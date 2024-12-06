# getUserJobs

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
        userId: STRING
    }
}
"""


def lambda_handler(event, context):
    try:
        userId = event["requestContext"]["authorizer"]["claims"]["sub"]

        if not userId:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "Error: Could not find cognito userId"}),
            }

        params = {
            "TableName": DYNAMO_TABLE,
            "FilterExpression": "userId = :user_id",
            "ExpressionAttributeValues": {
                ":user_id": {"S": userId}  # Attribute type 'S' denotes string
            },
        }

        items = []

        # Query the table
        while True:
            response = dynamodb.scan(**params)
            items.extend(response.get("Items", []))

            # Check for pagination
            if "LastEvaluatedKey" in response:
                params["ExclusiveStartKey"] = response["LastEvaluatedKey"]
            else:
                break

        items = [format_item(item) for item in items]

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"jobs": items}),
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
