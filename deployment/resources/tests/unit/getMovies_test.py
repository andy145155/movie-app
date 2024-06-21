import os
import json
from unittest import TestCase
from unittest.mock import MagicMock, patch
from moto import mock_aws
from utils.classes import LambdaDynamoDBClass
from boto3 import resource, client

"""Mocked AWS Credentials for moto."""
os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_SECURITY_TOKEN"] = "testing"
os.environ["AWS_SESSION_TOKEN"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"


# Mock the DynamoDB Service during the test
@mock_aws
class TestGetMoviesLambda(TestCase):
    """
    Test class for the application getMovies Lambda function
    """

    def setUp(self) -> None:

        self.test_ddb_table_name = "unit_test_ddb_table_name"
        os.environ["MOVIES_SIMILARITY_DYNAMO_DB_NAME"] = self.test_ddb_table_name

        dynamodb = resource("dynamodb", region_name="us-east-1")
        dynamodb.create_table(
            TableName=self.test_ddb_table_name,
            KeySchema=[{"AttributeName": "movieId", "KeyType": "HASH"}],
            AttributeDefinitions=[
                {"AttributeName": "movieId", "AttributeType": "N"},
                {"AttributeName": "index", "AttributeType": "N"},
            ],
            BillingMode="PAY_PER_REQUEST",
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "getIndex",
                    "KeySchema": [{"AttributeName": "index", "KeyType": "HASH"}],
                    "Projection": {
                        "ProjectionType": "ALL",
                        "NonKeyAttributes": [
                            "string",
                        ],
                    },
                    "OnDemandThroughput": {
                        "MaxReadRequestUnits": 123,
                        "MaxWriteRequestUnits": 123,
                    },
                },
            ],
        )

        mocked_dynamodb_resource = {
            "resource": resource("dynamodb"),
            "table_name": self.test_ddb_table_name,
        }

        self.mocked_dynamodb_class = LambdaDynamoDBClass(mocked_dynamodb_resource)

        self.mocked_dynamodb_class.table.put_item(Item={"movieId": 1, "index": 1})

        self.mocked_dynamodb_class.table.put_item(Item={"movieId": 2, "index": 2})

    def test_get_movies_index_list(self):
        """
        Test get_movies_index_list function
        """
        from functions.getMovies import get_movies_index_list

        limit = 5
        is_random = True
        result = get_movies_index_list(limit, is_random)
        self.assertEqual(len(result), limit)

        limit = 5
        is_random = False
        result = get_movies_index_list(limit, is_random)
        self.assertEqual(len(result), limit)

        limit = 10
        is_random = True
        result = get_movies_index_list(limit, is_random)
        self.assertEqual(len(result), limit)

    def test_fetch_movie_by_index(self):
        """
        Test fetch_movie_by_index function
        """
        from functions.getMovies import fetch_movie_by_index

        index = 1
        movie = fetch_movie_by_index(index, self.mocked_dynamodb_class)
        self.assertEqual(movie["index"], index)

        index = 2
        movie = fetch_movie_by_index(index, self.mocked_dynamodb_class)
        self.assertEqual(movie["index"], index)

    def load_sample_event_from_file(self, test_event_file_name: str) -> dict:
        """
        Loads and validate test events from the file system
        """
        event_file_name = f"tests/events/{test_event_file_name}.json"
        with open(event_file_name, "r", encoding="UTF-8") as file_handle:
            event = json.load(file_handle)
            return event

    @patch("utils.classes.LambdaDynamoDBClass")
    @patch("utils.functions.ok")
    @patch("functions.getMovies.get_movies_index_list")
    @patch("functions.getMovies.fetch_movie_by_index")
    def test_lambda_handler_valid_event(
        self,
        patch_fetch_movie_by_index: MagicMock,
        patch_get_movies_index_list: MagicMock,
        patch_ok: MagicMock,
        patch_lambda_dynamodb_class: MagicMock,
    ):

        patch_lambda_dynamodb_class.return_value = self.mocked_dynamodb_class
        patch_get_movies_index_list.return_value = [1]
        patch_fetch_movie_by_index.return_value = {"movieId": 1, "index": 1}

        expected_return_value = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
            },
            "body": json.dumps([{"movieId": 1, "index": 1}]),
        }

        patch_ok.return_value = expected_return_value

        from functions.getMovies import handler

        test_event = self.load_sample_event_from_file("getMovies")
        actual_return_value = handler(event=test_event, context=None)

        patch_get_movies_index_list.assert_called_once()

        self.assertEqual(actual_return_value, expected_return_value)

    def tearDown(self) -> None:
        dynamodb_resource = client("dynamodb", region_name="us-east-1")
        dynamodb_resource.delete_table(TableName=self.test_ddb_table_name)
