from boto3 import resource
from utils.functions import check_lambda_warmup, ok, get_movies_by_id_list
from utils.types import UserSelection
import os
import logging
from utils.classes import LambdaDynamoDBClass
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEvent
from aws_lambda_powertools.utilities.typing import LambdaContext

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get environment variable
USER_SELECTION_DYNAMO_DB_NAME = os.getenv("USER_SELECTION_DYNAMO_DB_NAME")
MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Set up DynamoDB resource
_MOVIE_SIMILARITY_DYNAMODB_RESOURCE = {
    "resource": resource("dynamodb"),
    "table_name": MOVIES_SIMILARITY_DYNAMO_DB_NAME,
}

_USER_SELECTION_DYNAMODB_RESOURCE = {
    "resource": resource("dynamodb"),
    "table_name": USER_SELECTION_DYNAMO_DB_NAME,
}


def handler(event: APIGatewayProxyEvent, context: LambdaContext) -> dict[str, any]:
    logger.info(event)

    if check_lambda_warmup(event):
        return "Lambda is warmed"

    if not USER_SELECTION_DYNAMO_DB_NAME:
        raise ValueError("Missing environment variable: USER_SELECTION_DYNAMO_DB_NAME")

    if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
        raise ValueError(
            "Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME"
        )

    movie_dynamodb_resource = LambdaDynamoDBClass(_MOVIE_SIMILARITY_DYNAMODB_RESOURCE)
    user_dynamodb_resource = LambdaDynamoDBClass(_USER_SELECTION_DYNAMODB_RESOURCE)

    params = event["queryStringParameters"]

    email: str = params.get("email")
    logger.info(f"Fetching recommendations for user: {email}")

    response = fetch_user_selection(email, user_dynamodb_resource)
    recommended_movieid_list, selected_movieid_list = validate_input(response)

    logger.info("recommended_movieid_list: %s", recommended_movieid_list)
    logger.info("selected_movieid_list: %s", selected_movieid_list)

    if len(recommended_movieid_list) == 0:
        recommended_movies = []
    else:
        recommended_movies = get_movies_by_id_list(
            recommended_movieid_list, movie_dynamodb_resource
        )

    if len(selected_movieid_list) == 0:
        selected_movies = []
    else:
        selected_movies = get_movies_by_id_list(
            selected_movieid_list, movie_dynamodb_resource
        )

    return ok(
        {
            "email": email,
            "recommendedMovies": recommended_movies,
            "selectedMovies": selected_movies,
        }
    )


def fetch_user_selection(email: str, dynamo_db: LambdaDynamoDBClass) -> UserSelection:
    try:
        response = dynamo_db.table.get_item(Key={"email": email})

        if "Item" not in response:
            return {"email": email, "recommendedMovies": [], "selectedMovies": []}

        return response["Item"]
    except Exception as e:
        logger.error("Error getting user movie selection: %s", e)
        return e


def validate_input(response: UserSelection) -> tuple[list[str], list[int]]:
    recommended_movieid_list = response.get("recommendedMovies", [])
    selected_movieid_list = response.get("selectedMovies", [])

    return recommended_movieid_list, selected_movieid_list
