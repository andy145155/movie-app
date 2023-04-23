try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import checkLambdaWarmUp, listS3Objects
from utils.constants import TMDB_5000_CSV
import json


def handler(event, context):
    print(json.dumps(event))
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    payload = event["queryStringParameters"]
    email = payload["email"]

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table('user_selection')

        response = table.get_item(
            Key={
                "email": email
            }
        )

        print("response", response)

        if 'Item' in response:
            recommendedMovies = response["Item"]["recommendedMovies"]
            selectedMovies = response["Item"]["selectedMovies"]
            message = {
                'message': {
                    'email': email,
                    'recommendedMovies': recommendedMovies,
                    'selectedMovies': selectedMovies
                }
            }
        else:
            message = {
                'message': {
                    'email': email,
                    'recommendedMovies': [],
                    'selectedMovies': []
                }
            }

    except Exception as e:
        print("Error getting data from dynamodb: ", e)
        return e

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': "true",
        },
        'body': json.dumps(message,
                           default=str
                           )
    }
