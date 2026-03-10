import json
import boto3

sns = boto3.client('sns')

TOPIC_ARN = "YOUR_SNS_ARN"

def lambda_handler(event, context):

    if 'body' in event:
        body = json.loads(event['body'])
    else:
        body = event

    blood_group = body['blood_group']
    hospital = body['hospital']
    address = body['address']
    city = body['city']
    contact = body['contact']

    message = f"""
URGENT BLOOD REQUEST

Blood Group Needed: {blood_group}
Hospital: {hospital}
Address: {address}
City: {city}

Contact: {contact}

If you can donate, please contact immediately.
"""

    sns.publish(
        TopicArn=TOPIC_ARN,
        Subject="Urgent Blood Request",
        Message=message
    )

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps("Blood request alert sent to donors")
    }
