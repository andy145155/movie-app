import boto3
from utils.functions import check_lambda_warmup, ok, get_movies_by_id_list
from utils.types import UserSelection 
import os
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get environment variable
USER_SELECTION_DYNAMO_DB_NAME = os.getenv("USER_SELECTION_DYNAMO_DB_NAME")
if not USER_SELECTION_DYNAMO_DB_NAME:
    raise ValueError("Missing environment variable: USER_SELECTION_DYNAMO_DB_NAME")

MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")
if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
    raise ValueError("Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Set up DynamoDB resource
dynamodb = boto3.resource("dynamodb")
user_selsction_table = dynamodb.Table(USER_SELECTION_DYNAMO_DB_NAME)

def handler(event: dict, context: dict ) -> dict:
    logger.info(event)
    
    if check_lambda_warmup(event):
        return "Lambda is warmed"

    params = event["queryStringParameters"]
    
    email = params.get("email")

    response = fetch_user_selection(email)
    recommended_movieid_list, selected_movieid_list = validate_input(response)
    
    logger.info("recommended_movieid_list: %s", recommended_movieid_list)
    logger.info("selected_movieid_list: %s", selected_movieid_list)
    
    recommended_movies = get_movies_by_id_list(recommended_movieid_list, table_name=MOVIES_SIMILARITY_DYNAMO_DB_NAME)
    
    selected_movies = get_movies_by_id_list(selected_movieid_list, table_name=MOVIES_SIMILARITY_DYNAMO_DB_NAME)
    
    return ok({
        'email': email,
        'recommendedMovies': recommended_movies,
        'selectedMovies': selected_movies
    })

def fetch_user_selection(email: str) -> UserSelection:
    try:
        response = user_selsction_table.get_item(
            Key={
                "email": email
            }
        )
        return response['Item']
    except Exception as e:
        logger.error("Error getting user movie selection: %s", e)
        return e
      
def validate_input(response: UserSelection) -> tuple[list[str], list[int]]:
    try:
        recommended_movieid_list = response.get("recommendedMovies", [])
        selected_movieid_list = response.get("selectedMovies", [])
        
        return recommended_movieid_list, selected_movieid_list
    except Exception as e:
        logger.error("Validation error: %s", e)
        return e