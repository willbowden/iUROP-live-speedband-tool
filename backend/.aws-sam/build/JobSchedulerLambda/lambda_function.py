# jobScheduler

import boto3
import uuid
import json
from datetime import datetime, timedelta

# Initialise AWS services
dynamodb = boto3.resource("dynamodb")
eventbridge = boto3.client("events")

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
        userId: STRING,
        apiKey: STRING,
        durationMinutes: INTEGER,
        frequencyMinutes: INTEGER,
        speedbands: [
            {
                cameraId: STRING,
                linkId: STRING
            }, 
            ...
        ]
    }
}
"""


def lambda_handler(event, context):
    # Parse input from API Gateway
    body = json.loads(event["body"])
    user_id = body["userId"]
    api_key = body["apiKey"]
    duration = body["durationMinutes"]
    frequency = body["frequencyMinutes"]
    speedbands = body["speedbands"]

    try:
        assert (
            type(user_id) == str and len(user_id) > 0
        ), '"userId" must be a defined string'
        assert type(api_key) == str and len(
            api_key
        ), '"apiKey" must be a defined string'
        assert type(duration) == int and duration in [
            1,
            5,
            10,
            15,
            30,
        ], '"duration" must be an integer and one of [1, 5, 10, 15, 30]'
        assert type(frequency) == int and frequency in [
            5,
            10,
            15,
        ], '"frequency must" be an integer and one of [5, 10, 15]'
        assert (
            type(speedbands) == list
            and len(speedbands) > 0
            and "cameraId" in speedbands[0]
            and "linkId" in speedbands[0]
        ), "\"speedbands\" must be a list of dictionaries containing a 'cameraId' and 'linkId' each"
    except AssertionError as ae:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"message": f"Error: {ae}"})}

    try:
        # Generate a unique job ID
        job_id = str(uuid.uuid4())
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration)

        table = dynamodb.Table(DYNAMO_TABLE)

        # Save job metadata in DynamoDB
        response = table.put_item(
            Item={
                "jobId": job_id,
                "userId": user_id,
                "status": "Pending",
                "startTime": int(start_time.timestamp() * 1000),
                "endTime": int(end_time.timestamp() * 1000),
                "apiKey": api_key,
                "frequencyMinutes": f"{frequency}",
                "speedbands": json.dumps(speedbands),
            }
        )

        # Schedule recurring Lambda invocations
        rule_name = f"DataCollection_{job_id}"
        eventbridge.put_rule(
            Name=rule_name, ScheduleExpression=f"rate({frequency} minutes)"
        )

        eventbridge.put_targets(
            Rule=rule_name,
            Targets=[
                {
                    "Id": "1",
                    "Arn": "arn:aws:lambda:ap-southeast-1:537124958292:function:speedbands-DataCollectionLambda-5cjpVG33rNxL",
                    "Input": json.dumps({"body": {"jobId": job_id}}),
                }
            ],
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"jobId": job_id, "message": "Job created successfully"}),
        }
    except Exception as e:
        return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"message": str(e)})}
