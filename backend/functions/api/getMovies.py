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


def handler(event, context):
    print(event)
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    params = event["queryStringParameters"]
    number = params.get('number', None)
    ran = params.get('random', None)
    movieIdList = params.get('movieIdList', None)

    print(number)
    print(ran)
    print(movieIdList)
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"])
    resultList = []

    try:
        if number is not None:
            numberList = []
            if ran is not None and ran == "true":
                numberList = random.sample(range(4800), int(number))
                for randomNumber in numberList:
                    response = table.query(
                        IndexName='getIndex',
                        KeyConditionExpression=Key('index').eq(randomNumber)
                    )
                    resultList.append(response['Items'][0])
            else:
                numberList = (list(range(number)))
                for fixNumber in numberList:
                    response = table.query(
                        IndexName='getIndex',
                        KeyConditionExpression=Key('index').eq(fixNumber)
                    )
                    resultList.append(response['Items'][0])

        elif movieIdList is not None:
            batch_keys = {
                DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"]: {
                    'Keys': [{'movieId': int(movie)} for movie in set(json.loads(movieIdList))]
                }
            }
            response = dynamodb.batch_get_item(
                RequestItems=batch_keys,    ReturnConsumedCapacity='TOTAL')
            for movie in response["Responses"][DYNAMO_DB_TABLE_LIST["MOVIES_SIMILARITY"]]:
                resultList.append(
                    {
                        "movieId": movie['movieId'],
                        "poster": movie['poster'],
                        "similarity": movie['similarity'],
                        "overview": movie['overview'],
                        'title': movie['title']
                    })

    except Exception as e:
        print("Error getting movie data: ", e)
        return e

    message = {
        'message': resultList
    }

    return ok(json.dumps(message,  default=str
                         ))
