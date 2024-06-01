import os
import boto3
from utils.functions import ok, check_lambda_warmup
from boto3.dynamodb.conditions import Key
import random
import logging
from typing import Union, Optional
from utils.types import Movie

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get environment variables
MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")
if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
    raise ValueError("Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Set up DynamoDB resource
dynamodb = boto3.resource("dynamodb")
movie_similarity_table = dynamodb.Table(MOVIES_SIMILARITY_DYNAMO_DB_NAME)

TOTAL_NUMBER_OF_MOVES = 4800

def validate_input(params: dict) -> tuple[Optional[str], Optional[str]]:
    try:
        limit: Optional[str] = params.get('limit')
        is_random: Optional[str]  = params.get('random')
        
        return limit, is_random
    except Exception as e:
        logger.error("Input validation error: %s", e)
        return e

def handler(event: dict, context: dict) -> dict:
    logger.info(event)

    if check_lambda_warmup(event):
        return "Lambda is warmed"

    params = event["queryStringParameters"]
    
    limit, is_random = validate_input(params)
    logger.info("limit: %s", limit)
    logger.info("is_random: %s", is_random)

    result_list: list[Movie] = []

    try:
        if limit is not None:
            result_list = get_movies_by_number(
                int(limit), is_random == "true")

    except Exception as e:
        logger.error("Error getting movie data: %s", e)
        return e

    return ok(result_list)

def get_movies_by_number(limit: int, is_random: bool) -> list[Movie]:
    index_list = random.sample(range(1, TOTAL_NUMBER_OF_MOVES), limit) if is_random else range(limit)
    result_list = [fetch_movie_by_index(index) for index in index_list]
    
    return result_list

# Fetch movie with global secondary index
def fetch_movie_by_index(index: int) -> Movie:
    try:
        response = movie_similarity_table.query(
          IndexName='getIndex',
            KeyConditionExpression=Key('index').eq(index)
          )
        
        return response['Items'][0]
    except Exception as e:
        logger.error("Error getting movies by index: %s", e)
        return e

