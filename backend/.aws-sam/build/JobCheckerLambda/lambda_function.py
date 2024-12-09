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
            "body": json.dumps(
                {"message": 'Error: "jobId" is required but was not provided!'}
            ),
        }

    try:
        response = dynamodb.get_item(
            TableName=DYNAMO_TABLE, 
            Key={"jobId": {"S": job_id}},
            ExpressionAttributeNames={
                "#JI": "jobId",
                "#SA": "status",
                "#ST": "startTime",
                "#ET": "endTime",
                "#FQ": "frequencyMinutes"
            },
            ProjectionExpression="#JI, #SA, #ST, #ET, #FQ"
        )

        if "Item" in response:
            job = format_item(response["Item"])
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(job),
            }
        else:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": f"Job with ID {job_id} not found."}),
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": str(e)}),
        }
    
def format_item(item):
    """
    Convert DynamoDB's attribute dictionary to a plain Python dictionary.

    Args:
        item (dict): DynamoDB attribute dictionary.

    Returns:
        dict: Converted Python dictionary.
    """
    return {k: list(v.values())[0] for k, v in item.items()}
