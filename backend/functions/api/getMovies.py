try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import checkLambdaWarmUp, ok
from utils.constants import DYNAMO_DB_TABLE_LIST
from boto3.dynamodb.conditions import Key
import random
import json

# sls invoke local -f=getMovies --path sample/getMovies.json


def handler(event, context):
    print(event)

    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    params = event["queryStringParameters"]
    number = params.get('number', None)
    isRandom = params.get('random', None)
    movieIdList = params.get('movieIdList', None)

    print(number)
    print(isRandom)
    print(movieIdList)
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"])
    resultList = []

    try:
        if number is not None:
            resultList = getMoviesByNumber(
                table, int(number), isRandom == "true")
        elif movieIdList is not None:
            resultList = getMoviesByIdList(dynamodb, json.loads(movieIdList))
    except Exception as e:
        print("Error getting movie data: ", e)
        return e

    response = {
        'message': resultList
    }

    return ok(json.dumps(response,  default=str
                         ))


def getMoviesByNumber(table, number, isRandom):
    query_count = 4800
    number_list = random.sample(
        range(1, query_count), number) if isRandom else list(range(number))
    result_list = []

    for number in number_list:
        print(number)
        response = table.query(
            IndexName='getIndex',
            KeyConditionExpression=Key('index').eq(number)
        )
        result_list.append(response['Items'][0])

    return result_list


def getMoviesByIdList(dynamodb, movieIdList):
    batch_keys = {
        DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"]: {
            'Keys': [{'movieId': int(movie)} for movie in set(movieIdList)]
        }
    }

    response = dynamodb.batch_get_item(
        RequestItems=batch_keys, ReturnConsumedCapacity='TOTAL')

    result_list = []

    for movie in response["Responses"][DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"]]:
        result_list.append({
            "movieId": movie['movieId'],
            "poster": movie['poster'],
            "similarity": movie['similarity'],
            "overview": movie['overview'],
            'title': movie['title']
        })

    return result_list
