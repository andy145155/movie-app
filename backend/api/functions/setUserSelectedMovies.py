from utils.functions import check_lambda_warmup, ok, get_movies_by_id_list
import os
import json
from boto3 import resource
import logging
from typing import Optional, TypedDict
from utils.types import SelectedMovie, UserSelection
from utils.classes import LambdaDynamoDBClass
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEvent
from aws_lambda_powertools.utilities.typing import LambdaContext


class BodyRequest(TypedDict):
    email: str
    selectedMovies: list[SelectedMovie]


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


def extract_and_validate_data(body: BodyRequest) -> tuple[str, list[SelectedMovie]]:
    email: Optional[str] = body.get("email")
    selectedMovies: list[SelectedMovie] = body.get("selectedMovies", [])

    if not email:
        raise ValueError("Missing email in request body")
    if len(selectedMovies) == 0:
        raise ValueError("Missing selected movies in request body")

    return email, selectedMovies


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

    body = event.get("body")

    if not body:
        raise ValueError("Missing request body")

    body = json.loads(body)
    email, selectedMovies = extract_and_validate_data(body)

    logger.info(f"email: {email}")
    logger.info(f"selectedMovies: {selectedMovies}")

    selected_movieid_list: list[int] = [
        json.loads(movie["movieId"]) for movie in selectedMovies
    ]
    recommended_movieid_list: list[str] = [
        id for movie in selectedMovies for id in movie["similarity"]
    ]

    item: UserSelection = {
        "email": email,
        "recommendedMovies": recommended_movieid_list,
        "selectedMovies": selected_movieid_list,
    }

    logger.info("Item to be uploaded: %s", item)

    try:
        user_dynamodb_resource.table.put_item(Item=item)
    except Exception as e:
        logger.error(f"Error uploading data to dynamodb: {e}")
        return e

    recommended_movies = get_movies_by_id_list(
        recommended_movieid_list, movie_dynamodb_resource
    )
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
