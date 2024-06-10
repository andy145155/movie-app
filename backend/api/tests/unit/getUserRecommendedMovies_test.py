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
class TestGetUserRecommenedMoviesLambda(TestCase):
    """
    Test class for the application getUserRecommenedMovies Lambda function
    """

    def setUp(self) -> None:

        self.movie_ddb_table_name = "movie_ddb_table_name"
        self.user_selection_ddb_table_name = "user_selection_ddb_table_name"

        os.environ["MOVIES_SIMILARITY_DYNAMO_DB_NAME"] = self.movie_ddb_table_name
        os.environ["USER_SELECTION_DYNAMO_DB_NAME"] = self.user_selection_ddb_table_name

        movies_dynamodb = resource("dynamodb", region_name="us-east-1")
        user_selection_dynamodb = resource("dynamodb", region_name="us-east-1")

        movies_dynamodb.create_table(
            TableName=self.movie_ddb_table_name,
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

        user_selection_dynamodb.create_table(
            TableName=self.user_selection_ddb_table_name,
            KeySchema=[{"AttributeName": "email", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "email", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )

        mocked_movies_dynamodb_resource = {
            "resource": resource("dynamodb"),
            "table_name": self.movie_ddb_table_name,
        }

        mocked_user_selection_dynamodb_resource = {
            "resource": resource("dynamodb"),
            "table_name": self.user_selection_ddb_table_name,
        }

        self.mocked_movies_dynamodb_class = LambdaDynamoDBClass(
            mocked_movies_dynamodb_resource
        )
        self.mocked_user_selection_dynamodb_class = LambdaDynamoDBClass(
            mocked_user_selection_dynamodb_resource
        )

        self.mocked_movies_dynamodb_class.table.put_item(
            Item={"movieId": 1, "index": 1}
        )

        self.mocked_movies_dynamodb_class.table.put_item(
            Item={"movieId": 2, "index": 2}
        )

        self.mocked_user_selection_dynamodb_class.table.put_item(
            Item={
                "email": "test@gmail.com",
                "recommendedMovies": [1, 2],
                "selectedMovies": [1],
            }
        )

    def test_fetch_user_selection(self):
        """
        Test fetch_user_selection function
        """
        from functions.getUserRecommendMovies import fetch_user_selection

        email = "test@gmail.com"
        expected_return_value = {
            "email": email,
            "recommendedMovies": [1, 2],
            "selectedMovies": [1],
        }

        result = fetch_user_selection(email, self.mocked_user_selection_dynamodb_class)
        self.assertEqual(result, expected_return_value)

        empty_email = "empty@gmail.com"
        expected_return_value = {
            "email": empty_email,
            "recommendedMovies": [],
            "selectedMovies": [],
        }

        result = fetch_user_selection(
            empty_email, self.mocked_user_selection_dynamodb_class
        )
        self.assertEqual(result, expected_return_value)

    def tearDown(self) -> None:
        dynamodb_resource = client("dynamodb", region_name="us-east-1")
        dynamodb_resource.delete_table(TableName=self.movie_ddb_table_name)
        dynamodb_resource.delete_table(TableName=self.user_selection_ddb_table_name)
