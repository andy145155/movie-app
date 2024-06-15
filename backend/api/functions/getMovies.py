import os
from boto3 import resource
from utils.functions import ok, check_lambda_warmup
from boto3.dynamodb.conditions import Key
import random
import logging
from utils.classes import LambdaDynamoDBClass
from utils.types import Movie
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEvent
from aws_lambda_powertools.utilities.typing import LambdaContext


# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get environment variables
MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Set up DynamoDB resource
_MOVIE_SIMILARITY_DYNAMODB_RESOURCE = {
    "resource": resource("dynamodb"),
    "table_name": MOVIES_SIMILARITY_DYNAMO_DB_NAME,
}

TOTAL_NUMBER_OF_MOVES = 4800


def handler(event: APIGatewayProxyEvent, context: LambdaContext) -> dict[str, any]:
    logger.info(event)

    if check_lambda_warmup(event):
        return "Lambda is warmed"

    if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
        raise ValueError(
            "Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME"
        )

    movie_dynamodb_resource = LambdaDynamoDBClass(_MOVIE_SIMILARITY_DYNAMODB_RESOURCE)
    params = event["queryStringParameters"]

    limit: str = params["limit"]
    random: str = params["random"]

    logger.info("limit: %s", limit)
    logger.info("random: %s", random)

    result_list: list[Movie] = []

    try:
        index_list = get_movies_index_list(int(limit), random == "true")
        result_list = [
            fetch_movie_by_index(index, movie_dynamodb_resource) for index in index_list
        ]

    except Exception as e:
        logger.error("Error getting movie data: %s", e)
        return e

    return ok(result_list)


def get_movies_index_list(limit: int, is_random: bool) -> list[int] | range:
    index_list = (
        random.sample(range(1, TOTAL_NUMBER_OF_MOVES), limit)
        if is_random
        else range(limit)
    )
    return index_list


# Fetch movie with global secondary index
def fetch_movie_by_index(index: int, dynamo_db: LambdaDynamoDBClass) -> Movie:
    try:
        response = dynamo_db.table.query(
            IndexName="getIndex", KeyConditionExpression=Key("index").eq(index)
        )
        return response["Items"][0]
    except Exception as e:
        logger.error("Error getting movies by index: %s", e)
        return e
