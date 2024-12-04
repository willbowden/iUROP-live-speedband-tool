# jobChecker

import boto3
import json

dynamodb = boto3.client("dynamodb")
s3 = boto3.client("s3")

DYNAMO_TABLE = "DataCollectionJobs"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

"""
INPUT FORMAT:
event = {
    body: {
        jobId: STRING
    }
}
"""


def lambda_handler(event, context):
    body = json.loads(event["body"])
    job_id = body["jobId"]

    if not job_id:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": 'Error: "jobId" is required but was not provided!'}),
        }

    try:
        response = dynamodb.get_item(
            TableName=DYNAMO_TABLE, Key={"jobId": {"S": job_id}}
        )

        if "Item" in response:
            status = response["Item"]["status"]["S"]
            return {"statusCode": 200, "body": json.dumps({"jobId": job_id, "status": status})}
        else:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": f"Job with ID {job_id} not found."}),
            }

    except Exception as e:
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"message": str(e)})}
