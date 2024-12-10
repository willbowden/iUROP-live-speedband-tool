# dataCollection

import json
import boto3
import pandas as pd

from io import StringIO
from datetime import datetime
from botocore.exceptions import ClientError
from src.GetSpeedbands import get_speedbands_and_images, BadKeyException

# Initialise AWS services
dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")
eventbridge = boto3.client("events")

DYNAMO_TABLE = "DataCollectionJobs"
S3_BUCKET = "results-537124958292-ap-southeast-1"


def disable_rule(job_id: str):
    table = dynamodb.Table(DYNAMO_TABLE)

    table.update_item(
        Key={"jobId": job_id},
        UpdateExpression="SET #status = :completed, #apiKey = :empty",
        ExpressionAttributeNames={"#status": "status", "#apiKey": "apiKey"},
        ExpressionAttributeValues={":completed": "Complete", ":empty": ""},
    )

    # Cancel the eventbridge rule
    rule_name = f"DataCollection_{job_id}"

    targets = eventbridge.list_targets_by_rule(Rule=rule_name)
    target_ids = [target["Id"] for target in targets["Targets"]]

    if target_ids:
        eventbridge.remove_targets(Rule=rule_name, Ids=target_ids)

    eventbridge.delete_rule(Name=rule_name)


"""
INPUT FORMAT:
event = {
    body: {
        jobId: STRING
    }
}
"""


def lambda_handler(event, context):
    try:
        body = event["body"]
        job_id = body["jobId"]

        # Fetch job metadata from DynamoDB
        table = dynamodb.Table(DYNAMO_TABLE)
        job = table.get_item(Key={"jobId": job_id})["Item"]

        try:
            object_key = f"{job_id}.csv"
            csv_obj = s3.get_object(Bucket=S3_BUCKET, Key=object_key)
            body = csv_obj['Body']
            csv_string = body.read().decode('utf-8')

            df = pd.read_csv(StringIO(csv_string))

        except Exception as e:
            df = pd.DataFrame(
                columns=[
                    "CameraID",
                    "LinkID",
                    "RoadName",
                    "SpeedBand",
                    "RoadCategory",
                    "MinimumSpeed",
                    "MaximumSpeed",
                    "StartCoords",
                    "EndCoords",
                    "ImageURL",
                ]
            )

        speedbands = json.loads(job["speedbands"])
        next_batch = get_speedbands_and_images(speedbands, job["apiKey"])

        df = pd.concat([df, next_batch])

        # Write extended dataframe to s3
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)

        s3.put_object(Bucket=S3_BUCKET, Key=f"{job_id}.csv", Body=csv_buffer.getvalue())

        if datetime.now() > datetime.fromtimestamp(int(job["endTime"]) / 1000):
            disable_rule(job_id)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data collection step successful"})
        }
    except BadKeyException:
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression="SET #status = :failed, #reason = :reason",
            ExpressionAttributeNames={"#status": "status", "#reason": "reason"},
            ExpressionAttributeValues={
                ":failed": "Failed",
                ":reason": "Bad or missing API key",
            },
        )

        disable_rule(job_id)
    except Exception as e:
        raise e
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

        # table.update_item(
        #     Key={"jobId": job_id},
        #     UpdateExpression="SET #status = :failed",
        #     ExpressionAttributeNames={"#status": "status"},
        #     ExpressionAttributeValues={":failed": "Failed"},
        # )
