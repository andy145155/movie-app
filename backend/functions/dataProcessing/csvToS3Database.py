'''
This function handles the topic notification from SNS 
and transform raw CSV files to destination S3 bucket
'''

try:
    import unzip_requirements
except ImportError:
    pass

from utils.apiFunctions import uploadCsvToS3, getInfoFromSNS, convertToStringColumn, getS3Object, checkLambdaWarmUp
from utils.constants import TMDB_5000_CSV, S3_BUCKETS_NAME, S3_DATABASE_FILE_PATH
from io import StringIO
import pandas as pd


# Define the handler function
def handler(event, context):
    print(event)

    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    bucket, key = getInfoFromSNS(event)
    csv_data = getS3Object(bucket, key)
    df_csv_data = pd.read_csv(StringIO(csv_data))
    csv_object = convertToStringColumn(df_csv_data)

    try:
        # Check which CSV file is being uploaded
        if key == TMDB_5000_CSV["CREDITS"]:
            uploadCsvToS3(S3_DATABASE_FILE_PATH["CREDITS"],
                          S3_BUCKETS_NAME["DATABASE"], csv_object)
            print(
                f"""{TMDB_5000_CSV["CREDITS"]} successfully insert into s3 bucket""")
        elif key == TMDB_5000_CSV["MOVIES"]:
            uploadCsvToS3(S3_DATABASE_FILE_PATH["MOVIES"],
                          S3_BUCKETS_NAME["DATABASE"], csv_object)
            print(
                f"""{TMDB_5000_CSV["MOVIES"]} successfully insert into s3 bucket""")
        else:
            raise Exception("Unknown input object")
    except Exception as error:
        print("Error uploading raw movie app data to S3 bucket:", error)

    return
