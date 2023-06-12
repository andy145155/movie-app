try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import checkLambdaWarmUp, ok
from utils.constants import DYNAMO_DB_TABLE_LIST
import json

# sls invoke local -f=setUserSelectedMovies --path sample/setUserSelectedMovies.json


def handler(event, context):
    print(json.dumps(event))
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    payload = event.get("queryStringParameters", {})
    email = payload.get("email")
    selectedMovies = payload.get("selectedMovies", [])

    print("email: ", email)
    selectedMovieIdList = []
    recommenedMovieIdList = []

    for movie in json.loads(selectedMovies):
        selectedMovieIdList.append(json.loads(movie["movieId"]))
        recommenedMovieIdList.extend(movie["similarity"])

    item = {
        'email': email,
        'recommendedMovies': recommenedMovieIdList,
        'selectedMovies': selectedMovieIdList,
    }
    print("item: ", item)

    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(DYNAMO_DB_TABLE_LIST["USER_SELECTION"])
        print("table: ", table)

        table.put_item(
            Item=item
        )

    except Exception as e:
        print("Error uploading data to dynamodb: ", e)
        return {
            'statusCode': 500,
            'body': 'Internal Server Error'
        }

    return ok(json.dumps(item,
                         default=str
                         ))
