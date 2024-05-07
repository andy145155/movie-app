'''
This function will trigger a Glue Crawler when an S3 event is detected.
'''
import os
import boto3
import logging
from botocore.exceptions import ClientError
from utils.constants import S3_PROCESSED_FILE_PATH

# Get environment variables
GLUE_CRAWLER_CREDITS = os.getenv("GLUE_CRAWLER_CREDITS")
GLUE_CRAWLER_MOVIES = os.getenv("GLUE_CRAWLER_MOVIES")
GLUE_CRAWLER_SIMILARITY = os.getenv("GLUE_CRAWLER_SIMILARITY")

# Check if environment variables are set
if not GLUE_CRAWLER_CREDITS:
    raise ValueError("Missing environment variable: GLUE_CRAWLER_CREDITS")
if not GLUE_CRAWLER_MOVIES:
    raise ValueError("Missing environment variable: GLUE_CRAWLER_MOVIES")
if not GLUE_CRAWLER_SIMILARITY:
    raise ValueError("Missing environment variable: GLUE_CRAWLER_SIMILARITY")

GLUE_CRAWLER = {
    "CREDITS": GLUE_CRAWLER_CREDITS,
    "MOVIES": GLUE_CRAWLER_MOVIES,
    "SIMILARITY": GLUE_CRAWLER_SIMILARITY,
}

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

glue_client = boto3.client('glue')

def trigger_glue_crawler(crawler_name: str) -> None:
    try:
        glue_client.start_crawler(Name=crawler_name)
    except ClientError as e:
        logger.error(f"boto3 client error in start_a_crawler: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in start_a_crawler: {e}")
        raise


def handler(event: dict, context) -> None:
    logger.info(f"Received event: {event}")
    csv_name = event['Records'][0]['s3']['object']['key']
    
    try:
        if csv_name in S3_PROCESSED_FILE_PATH.values():
            for crawler_name, file_path in S3_PROCESSED_FILE_PATH.items():
                if csv_name == file_path:
                    trigger_glue_crawler(GLUE_CRAWLER[crawler_name])
                    logger.info(f"Successfully triggered {GLUE_CRAWLER[crawler_name]}")
                    break
        else:
            raise Exception("Unknown input object")
    except Exception as error:
        logger.error(f"Error in handler: {error}")
        raise