import json
from utils.types import Movie
import logging
from utils.classes import LambdaDynamoDBClass


def check_lambda_warmup(event: dict) -> bool:
    if event.get("source") == "warmup":
        return True
    return False


def ok(body: dict) -> dict:
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        },
        "body": json.dumps(body, default=str),
    }


# Batch get items only support using partition key
def batch_get_dynamodb_item(
    batch_keys: dict[str, dict], dynamo_db: LambdaDynamoDBClass
) -> dict[str, list[Movie]]:
    try:
        response = dynamo_db.resource.batch_get_item(
            RequestItems=batch_keys, ReturnConsumedCapacity="TOTAL"
        )

        return response["Responses"]
    except Exception as e:
        logging.error("Error getting movies by id list: %s ", e)
        return e


def get_movies_by_id_list(
    movieid_list: list[str], dynamo_db: LambdaDynamoDBClass
) -> list[Movie]:

    batch_keys = {
        dynamo_db.table_name: {
            "Keys": [{"movieId": int(movieId)} for movieId in set(movieid_list)]
        }
    }

    response = batch_get_dynamodb_item(batch_keys, dynamo_db)

    return [movie for movie in response[dynamo_db.table_name]]
