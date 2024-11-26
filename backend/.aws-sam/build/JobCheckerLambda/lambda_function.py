import boto3

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')

DYNAMO_TABLE = 'DataCollectionJobs'

"""
INPUT FORMAT:
event = {
    body: {
        jobId: STRING
    }
}
"""
def lambda_handler(event):
    body = event['body']
    job_id = body['jobId']

    if not job_id:
        return {
            "statusCode": 400,
            "body": {
                "message": "Error: \"jobId\" is required but was not provided!"
            }
        }

    try:
        response = dynamodb.get_item(
            TableName=DYNAMO_TABLE,
            Key={
                'jobId': {
                    'S': job_id
                }
            }
        )

        if 'Item' in response:
            status = response['Item']['status']['S']
            return {
                "statusCode": 200,
                "body": {
                    "jobId": job_id,
                    "status": status
                }
            }
        else:
            return {
                "statusCode": 404,
                "body": {
                    "message": f"Job with ID {job_id} not found."
                }
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "message": str(e)
            }
        }


