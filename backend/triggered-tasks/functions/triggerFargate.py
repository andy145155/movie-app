import boto3
from botocore.exceptions import ClientError
import os
import logging
import json
from utils.functions import get_s3_info_from_sns
from utils.constants import TMDB_5000_CSV, MOVIE_APP_REGION_NAME
from typing import List

# Get environment variables
MOVIE_APP_ESC_CLUSTER_ARN = os.getenv("MOVIE_APP_ESC_CLUSTER_ARN")
DATA_PROCESSING_TASK_DEFINITION_ARN = os.getenv("DATA_PROCESSING_TASK_DEFINITION_ARN")
MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")
MOVE_CSV_PROCESSED_BUCKET_NAME = os.getenv("MOVE_CSV_PROCESSED_BUCKET_NAME")
MOVE_CSV_SOURCE_BUCKET_NAME = os.getenv("MOVE_CSV_SOURCE_BUCKET_NAME")
SUBNET_A_ID = os.getenv("SUBNET_A_ID")
SUBNET_B_ID = os.getenv("SUBNET_B_ID")
FARGATE_SG_ID = os.getenv("FARGATE_SG_ID")

# Check if environment variables are set
if not MOVIE_APP_ESC_CLUSTER_ARN:
    raise ValueError("Missing environment variable: MOVIE_APP_ESC_CLUSTER_ARN")
if not DATA_PROCESSING_TASK_DEFINITION_ARN:
    raise ValueError("Missing environment variable: DATA_PROCESSING_TASK_DEFINITION_ARN")
if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
    raise ValueError("Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME")
if not MOVE_CSV_PROCESSED_BUCKET_NAME:
    raise ValueError("Missing environment variable: MOVE_CSV_PROCESSED_BUCKET_NAME")
if not MOVE_CSV_SOURCE_BUCKET_NAME:
    raise ValueError("Missing environment variable: MOVE_CSV_SOURCE_BUCKET_NAME")
if not SUBNET_A_ID:
    raise ValueError("Missing environment variable: SUBNET_A_ID")
if not SUBNET_B_ID:
    raise ValueError("Missing environment variable: SUBNET_B_ID")
if not FARGATE_SG_ID:
    raise ValueError("Missing environment variable: FARGATE_SG_ID")

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Create aws client
s3 = boto3.client('s3', region_name=MOVIE_APP_REGION_NAME)
ecs_client = boto3.client('ecs')

def handler(event, context) -> None:
    logger.info(event)

    bucket, key = get_s3_info_from_sns(event)
    logger.info(f"Bucket name: {bucket}")
    
    s3_objects = list_s3_objects(bucket, prefix=TMDB_5000_CSV["PREFIX"])
    logger.info(f"Bucket objects: {s3_objects}")
    
    required_files = {TMDB_5000_CSV["CREDITS"], TMDB_5000_CSV["MOVIES"]}
    if not all(s3_object["Key"] in required_files for s3_object in s3_objects):
        missing_files = required_files - {s3_object["Key"] for s3_object in s3_objects}
        return f"The following files are missing: {', '.join(missing_files)}"

    response = runTask(ecs_client, cluster=MOVIE_APP_ESC_CLUSTER_ARN, task_definition=DATA_PROCESSING_TASK_DEFINITION_ARN)
    logger.info(response)

def list_s3_objects(bucket: str, prefix: str = None) -> List[object]:
    try:
        response = s3.list_objects(
            Bucket=bucket,
            Prefix=prefix,
        )
        return response.get("Contents", [])
    except ClientError as error:
        logger.error(f"Error listing objects in bucket {bucket}: {error}")
        return []


def runTask(client, cluster: str, task_definition: str) -> str:
    response = client.run_task(
        cluster=cluster,
        count=1,
        launchType='FARGATE',
        networkConfiguration={
            'awsvpcConfiguration': {
                'subnets': [
                   SUBNET_A_ID,
                   SUBNET_B_ID
                ],
                'securityGroups': [
                    FARGATE_SG_ID
                ],
                 'assignPublicIp': 'ENABLED'
            }
        },
        taskDefinition=task_definition
    )

    return json.dumps(response, default=str)
