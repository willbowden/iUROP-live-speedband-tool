# jobScheduler

import boto3
import uuid
from datetime import datetime, timedelta

# Initialise AWS services
dynamodb = boto3.client('dynamodb')
eventbridge = boto3.client('events')

DYNAMO_TABLE = 'DataCollectionJobs'

"""
INPUT FORMAT:
event = {
    body: {
        userId: STRING,
        jobId: STRING,
        durationMinutes: INTEGER,
        frequencyMinutes: INTEGER,
    }
}
"""
def lambda_handler(event, context):
    # Parse input from API Gateway
    body = event['body']
    user_id = body['userId']
    api_key = body['apiKey']
    duration = body['durationMinutes']
    frequency = body['frequencyMinutes']

    try:
        assert type(user_id) == str and len(user_id) > 0, "\"userId\" must be a defined string"
        assert type(api_key) == str and len(api_key), "\"apiKey\" must be a defined string"
        assert type(duration) == int and duration in [1, 5, 10, 15, 30], "\"duration\" must be an integer and one of [1, 5, 10, 15, 30]"
        assert type(frequency) == int and frequency in [5, 10, 15], "\"frequency must\" be an integer and one of [5, 10, 15]"
    except AssertionError as ae:
        return {
            "statusCode": 400,
            "body": {
                "message": f"Error: {ae}"
            }
        }

    try:
        # Generate a unique job ID
        job_id = str(uuid.uuid4())
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration)
        
        # Save job metadata in DynamoDB
        response = dynamodb.put_item(
            TableName=DYNAMO_TABLE,
            Item={
            'jobId': {'S': job_id},
            'userId': {'S': user_id},
            'status': {'S': 'Pending'},
            'startTime': {'S': start_time.isoformat()},
            'endTime': {'S': end_time.isoformat()},
            'apiKey': {'S': api_key},
            'frequencyMinutes': {'N': f"{frequency}"}
        })
        
        # Schedule recurring Lambda invocations
        rule_name = f"DataCollection_{job_id}"
        eventbridge.put_rule(
            Name=rule_name,
            ScheduleExpression=f'rate({frequency} minutes)'
        )
        eventbridge.put_targets(
            Rule=rule_name,
            Targets=[
                {
                    'Id': '1',
                    'Arn': 'arn:aws:lambda:ap-southeast-1:537124958292:function:dataCollection',
                    'Input': str({'jobId': job_id})
                }
            ]
        )
        
        return {
            "statusCode": 200,
            "body": {
                "jobId": job_id,
                "message": "Job created successfully"
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "message": str(e)
            }
        }