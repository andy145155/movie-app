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
_MOVIE_SIMILARITY_DYNAMODB_RESOURCE = { "resource" : resource('dynamodb'), 
                              "table_name" : MOVIES_SIMILARITY_DYNAMO_DB_NAME}

TOTAL_NUMBER_OF_MOVES = 4800


def handler(event: APIGatewayProxyEvent, context: LambdaContext) -> dict[str, any]:
    logger.info(event)
    
    if check_lambda_warmup(event):
        return "Lambda is warmed"

    if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
        raise ValueError("Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME")

    movie_dynamodb_resource = LambdaDynamoDBClass(_MOVIE_SIMILARITY_DYNAMODB_RESOURCE)
    params = event["queryStringParameters"]
    
    limit = params["limit"]
    random = params["random"]

    logger.info("limit: %s", limit)
    logger.info("random: %s", random)

    result_list: list[Movie] = []

    try:
        index_list = get_movies_index_list(
            int(limit), random == "true")
        result_list = [fetch_movie_by_index(index, movie_dynamodb_resource) for index in index_list]

    except Exception as e:
        logger.error("Error getting movie data: %s", e)
        return e
    
    return ok(result_list)

def get_movies_index_list(limit: int, is_random: bool) -> list[int] | range:
    index_list = random.sample(range(1, TOTAL_NUMBER_OF_MOVES), limit) if is_random else range(limit)
    return index_list

# Fetch movie with global secondary index
def fetch_movie_by_index(index: int, dynamo_db: LambdaDynamoDBClass) -> Movie:
    try:
        response = dynamo_db.table.query(
          IndexName='getIndex',
            KeyConditionExpression=Key('index').eq(index)
          )
        return response['Items'][0]
    except Exception as e:
        logger.error("Error getting movies by index: %s", e)
        return e


    @patch("src.sample_lambda.app.LambdaDynamoDBClass")
    @patch("src.sample_lambda.app.LambdaS3Class")
    @patch("src.sample_lambda.app.create_letter_in_s3")
    def test_lambda_handler_valid_event_returns_200(self,
                            patch_create_letter_in_s3 : MagicMock,
                            patch_lambda_s3_class : MagicMock,
                            patch_lambda_dynamodb_class : MagicMock
                            ):
        """
        Verify the event is parsed, AWS resources are passed, the 
        create_letter_in_s3 function is called, and a 200 is returned.
        """

        # [14] Test setup - Return a mock for the global variables and resources
        patch_lambda_dynamodb_class.return_value = self.mocked_dynamodb_class
        patch_lambda_s3_class.return_value = self.mocked_s3_class

        return_value_200 = {"statusCode" : 200, "body":"OK"}
        patch_create_letter_in_s3.return_value = return_value_200

        # [15] Run Test using a test event from /tests/events/*.json
        test_event = self.load_sample_event_from_file("sampleEvent1")
        test_return_value = lambda_handler(event=test_event, context=None)

        # [16] Validate the function was called with the mocked globals
        # and event values
        patch_create_letter_in_s3.assert_called_once_with(
                                        dynamo_db=self.mocked_dynamodb_class,
                                        s3=self.mocked_s3_class,
                                        doc_type=test_event["pathParameters"]["docType"],
                                        cust_id=test_event["pathParameters"]["customerId"])

        self.assertEqual(test_return_value, return_value_200)