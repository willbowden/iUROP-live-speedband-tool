# dataCollection

import boto3
from datetime import datetime

# Initialise AWS services
dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")
eventbridge = boto3.client('events')

DYNAMO_TABLE = "DataCollectionJobs"
S3_BUCKET = "results"

"""
INPUT FORMAT:
event = {
    body: {
        jobId: STRING
    }
}
"""
def lambda_handler(event, context):
    # Extract jobId from the EventBridge input
    body = event["body"]
    job_id = body["jobId"]

    # Fetch job metadata from DynamoDB
    table = dynamodb.Table(DYNAMO_TABLE)
    job = table.get_item(Key={"jobId": job_id})["Item"]

    # If the job has already ended, end it
    if datetime.now() > datetime.fromisoformat(job["endTime"]):
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression="SET #status = :completed",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":completed": "Completed"},
        )

        # Cancel the eventbridge rule
        rule_name = f"DataCollection_{job_id}"

        targets = eventbridge.list_targets_by_rule(Rule=rule_name)
        target_ids = [target['Id'] for target in targets['Targets']]

        if target_ids:
            eventbridge.remove_targets(Rule=rule_name, Ids=target_ids)

        eventbridge.delete_rule(Name=rule_name)

        return

    # Make the API request FOR TESTING
    response = {}
    response.text = "Hello from DataCollection!"
    response.status_code = 200

    if response.status_code == 200:
        # Write data to S3
        file_key = f"jobs/{job['userId']}/{job_id}/{datetime.now().isoformat()}.csv"
        s3.put_object(Bucket=S3_BUCKET, Key=file_key, Body=response.text)

        # Update DynamoDB with the latest data path
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression="SET lastResultPath = :path",
            ExpressionAttributeValues={":path": file_key},
        )
    else:
        # Log the error and update the job status
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression="SET #status = :failed",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":failed": "Failed"},
        )
