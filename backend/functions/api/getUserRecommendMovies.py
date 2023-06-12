try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import checkLambdaWarmUp, ok
from utils.constants import DYNAMO_DB_TABLE_LIST
import json

# sls invoke local -f=getUserRecommendMovies --path sample/getUserRecommendMovies.json


def handler(event, context):
    print(json.dumps(event))

    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    payload = event.get("queryStringParameters", {})
    email = payload.get("email")

    try:
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(DYNAMO_DB_TABLE_LIST['USER_SELECTION'])

        response = table.get_item(
            Key={
                "email": email
            }
        )

        print("response", response)

        if 'Item' in response:
            recommendedMovies = response["Item"].get("recommendedMovies", [])
            selectedMovies = response["Item"].get("selectedMovies", [])
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

    return ok(json.dumps(message,
                         default=str
                         ))
