import boto3
from botocore.exceptions import ClientError
from typing import Tuple, Dict, Union
from io import StringIO
import json
import pandas as pd
import logging
from utils.types import Movie 

def check_lambda_warmup(event: dict) -> bool:
    if event.get("source") == "warmup":
        return True
    return False

def get_s3_info_from_sns(event: dict) -> Tuple[str, str]:
    try:
        sns_message = json.loads(event['Records'][0]['Sns']['Message'])
        bucket = sns_message['Records'][0]['s3']['bucket']['name']
        key = sns_message['Records'][0]['s3']['object']['key']
        return bucket, key
    except KeyError as error:
        logging.error(f"Error retrieving csv from S3 trigger event: {error}")
        raise


def upload_to_s3(file_path: str, bucket: str, pd_object: pd.DataFrame) -> None:
    try:
        # Upload the file
        s3_client = boto3.client('s3')
        with StringIO() as csv_buffer:
            pd_object.to_csv(csv_buffer, index=False)

            response = s3_client.put_object(
                Bucket=bucket, Key=file_path, Body=csv_buffer.getvalue()
            )

            status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

            if status == 200:
                print(f"Successful S3 put_object response. Status - {status}")
            else:
                print(
                    f"Unsuccessful S3 put_object response. Status - {status}")
    except Exception as e:
        print("Error uploading csv to s3: ", e)
        return e

def get_s3_object(bucket: str, key: str) -> str:
    s3_client = boto3.client('s3')
    try:
        response = s3_client.get_object(Bucket=bucket, Key=key)
        data = response['Body'].read().decode('utf-8')
        return data
    except ClientError as error:
        print("Error retrieving object from S3 bucker: %s" % (error))


def upload_to_dynamoDB(pd_object: pd.DataFrame, table_name: str) -> None:
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(table_name)
        with table.batch_writer() as batch:
            for index, row in pd_object.iterrows():
                item = json.loads(row.to_json())
                batch.put_item(Item=item)
    except Exception as e:
        print("Error uploading data to dynamodb: ", e)
        print("Table: ", table_name)
        return e

def ok(body: dict) -> dict:
    print("body", body)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': "true",
        },
        'body': json.dumps(body, default=str)
    }
    
# Batch get items only support using partition key
def batch_get_dynamodb_item(batch_keys: dict[str, dict]) -> dict[str, list[Movie]]:
    dynamodb = boto3.resource("dynamodb")
    
    try:
        response = dynamodb.batch_get_item(
            RequestItems=batch_keys, ReturnConsumedCapacity='TOTAL')

        return response["Responses"]
    except Exception as e:
        logging.error("Error getting movies by id list: %s ", e)
        return e

def get_movies_by_id_list(movieid_list: list[str], table_name: str) -> list[Movie]:   
     
    batch_keys = {
        table_name: {
            'Keys': [{'movieId': int(movieId)} for movieId in set(movieid_list)]
        }
    }

    response = batch_get_dynamodb_item(batch_keys)

    return [movie for movie in response[table_name]]

