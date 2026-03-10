import json
import boto3

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

table = dynamodb.Table('DonorTable')

TOPIC_ARN = "Your_ARN"

def lambda_handler(event, context):

    if 'body' in event:
        body = json.loads(event['body'])
    else:
        body = event

    name = body['name']
    blood_group = body['blood_group']
    phone = body['phone']
    email = body['email']
    city = body['city']
    address = body['address']
    health_issue = body['health_issue']

    # Save donor in DynamoDB
    table.put_item(
        Item={
            'phone': phone,
            'name': name,
            'blood_group': blood_group,
            'email': email,
            'city': city,
            'address': address,
            'health_issue': health_issue
        }
    )

    # Subscribe donor to SNS topic
    sns.subscribe(
        TopicArn=TOPIC_ARN,
        Protocol='email',
        Endpoint=email
    )

    return {
        'statusCode': 200,
        'headers': {"Access-Control-Allow-Origin": "*"},
        'body': json.dumps("Registration successful. Please confirm email subscription.")
    }
