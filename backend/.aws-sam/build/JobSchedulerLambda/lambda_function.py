import boto3
import uuid
from datetime import datetime, timedelta

# Initialise AWS services
dynamodb = boto3.client('dynamodb')
eventbridge = boto3.client('events')

DYNAMO_TABLE = 'DataCollectionJobs'

def lambda_handler(event, context):
    # Parse input from API Gateway
    body = event['body']
    user_id = body['userId']
    api_key = body['apiKey']
    duration = body['durationMinutes']
    frequency = body['frequencyMinutes']
    
    # Generate a unique job ID
    job_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
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

    print(response)
    
    # Schedule recurring Lambda invocations
    # rule_name = f"DataCollection_{job_id}"
    # eventbridge.put_rule(
    #     Name=rule_name,
    #     ScheduleExpression=f'rate({frequency} minutes)'
    # )
    # eventbridge.put_targets(
    #     Rule=rule_name,
    #     Targets=[
    #         {
    #             'Id': '1',
    #             'Arn': 'arn:aws:lambda:ap-southeast-1:537124958292:function:dataCollection',
    #             'Input': str({'jobId': job_id})
    #         }
    #     ]
    # )
    
    return {
        "statusCode": 200,
        "body": {
            "jobId": job_id,
            "message": "Job created successfully"
        }
    }