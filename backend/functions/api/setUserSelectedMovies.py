try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import checkLambdaWarmUp
from utils.constants import DATABASE, DB_TABLE
import json

# sls invoke local -f=setUserSelectedMovies --path sample/setUserSelectedMovies.json


def handler(event, context):
    print(json.dumps(event))
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    payload = event["queryStringParameters"]
    email = payload["email"]
    selectedMovies = payload["selectedMovies"]
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
        table = dynamodb.Table('user_selection')
        print("table: ", table)

        table.put_item(
            Item=item
        )

    except Exception as e:
        print("Error uploading data to dynamodb: ", e)
        return e

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': "true",
        },
        'body': json.dumps(item)
    }
