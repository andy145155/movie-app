'''
This function handles the event trigger and uploads CSV files to AWS S3
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

    # Check if the Lambda function is being warmed up
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

   # Retrieve the bucket and key from the event
    bucket, key = getInfoFromSNS(event)

    # Retrieve the CSV data from the S3 bucket
    csv_data = getS3Object(bucket, key)

    # Convert CSV data to a Pandas DataFrame
    df_csv_data = pd.read_csv(StringIO(csv_data))

    # Convert DataFrame to a string with all columns as type string
    csv_object = convertToStringColumn(df_csv_data)

    try:
        # Check which CSV file is being uploaded
        if TMDB_5000_CSV["CREDITS"] == key:
            uploadCsvToS3(S3_DATABASE_FILE_PATH["CREDITS"],
                          S3_BUCKETS_NAME["DATABASE"], csv_object)
            print(
                f"""{TMDB_5000_CSV["CREDITS"]} successfully insert into s3 bucket""")
        elif TMDB_5000_CSV["MOVIES"] == key:
            uploadCsvToS3(S3_DATABASE_FILE_PATH["MOVIES"],
                          S3_BUCKETS_NAME["DATABASE"], csv_object)
            print(
                f"""{TMDB_5000_CSV["MOVIES"]} successfully insert into s3 bucket""")
        else:
            # Raise an exception if the input object is unknown
            raise Exception("Unknown input object")
    except Exception as error:
        # Print error message if there is an exception
        print("Error uploading raw movie app data to RDS: %s" % (error))
    return
