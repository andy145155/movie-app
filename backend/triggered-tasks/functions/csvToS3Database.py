'''
This function handles the topic notification from SNS 
and transfer raw CSV files to destination S3 bucket
'''
import os
import json
import logging
import pandas as pd
from io import StringIO
from ast import literal_eval
from utils.constants import TMDB_5000_CSV, S3_PROCESSED_FILE_PATH
from backend.utils.functions import upload_to_s3, get_s3_info_from_sns, get_s3_object

# Get environment variable
CSV_PROCESSED_BUCKET = os.getenv("MOVE_CSV_PROCESSED_BUCKET_NAME")
if not CSV_PROCESSED_BUCKET:
    raise ValueError("Missing environment variable: MOVE_CSV_PROCESSED_BUCKET_NAME")

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Define the handler function
def handler(event: dict, context) -> None:
    logger.info(f"Received event: {event}")
    bucket, key = get_s3_info_from_sns(event)
    csv_data = get_s3_object(bucket, key)
    df_csv_data = pd.read_csv(StringIO(csv_data))
    csv_object = convert_to_string_column(df_csv_data)
    
    key_to_path = {
        TMDB_5000_CSV["CREDITS"]: S3_PROCESSED_FILE_PATH["CREDITS"],
        TMDB_5000_CSV["MOVIES"]: S3_PROCESSED_FILE_PATH["MOVIES"],
    }

    try:
        # Check which CSV file is being uploaded
        if key in key_to_path:
            upload_to_s3(key_to_path[key], CSV_PROCESSED_BUCKET, csv_object)
            logger.info(f"{key} successfully inserted into S3 bucket")
        else:
            raise ValueError(f"Unknown input object: {key}")
    except Exception as error:
        logger.error(f"Error processing event: {error}")
        raise

def convert_to_string_column(datafame: pd.DataFrame) -> pd.DataFrame:
    for col in datafame:
        if (datafame[col].dtypes == 'object'):
            try:
                datafame[col].apply(literal_eval)
                datafame[col] = datafame[col].apply(
                    json.dumps).astype('string')
                datafame[col] = datafame[col].replace(
                    to_replace=r'\\', value='', regex=True)
            except:
                pass
    return datafame