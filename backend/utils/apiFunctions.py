try:
    import unzip_requirements
except ImportError:
    pass
from utils.constants import MOVIE_APP_REGION_NAME
import boto3
from botocore.exceptions import ClientError
from io import StringIO
import pandas as pd
import json
from ast import literal_eval

# Retrieve csv from SNS topic that contains S3 trigger event


def checkLambdaWarmUp(event):
    if event.get("source") == "warmup":
        return True
    return False


def getInfoFromSNS(event):

    try:
        # Get the object from the event
        snsNotification = json.loads(event['Records'][0]['Sns']['Message'])
        bucket = snsNotification['Records'][0]['s3']['bucket']['name']
        key = snsNotification['Records'][0]['s3']['object']['key']
        return bucket, key
    except ClientError as error:
        print("Error retrieving csv from S3 trigger event: %s" % (error))


def uploadCsvToS3(file_path, bucket, pd_object):
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


def triggerGlueCrawler(crawler_name):
    glue_client = boto3.client('glue')
    try:
        glue_client.start_crawler(Name=crawler_name)
    except ClientError as e:
        raise Exception(
            "boto3 client error in start_a_crawler: " + e.__str__())
    except Exception as e:
        raise Exception("Unexpected error in start_a_crawler: " + e.__str__())


def getS3Object(bucket, key):

    # Create S3 bucket client
    s3 = boto3.client('s3', region_name=MOVIE_APP_REGION_NAME)

    try:
        s3_object = s3.get_object(Bucket=bucket, Key=key)
        data = s3_object['Body'].read().decode('utf-8')
        return data
    except ClientError as error:
        print("Error retrieving object from S3 bucker: %s" % (error))


def getS3Objects(bucket, prefix=None):

    s3 = boto3.resource('s3')
    my_bucket = s3.Bucket(bucket)
    s3_objects = my_bucket.objects.filter(
        Prefix=prefix)
    return s3_objects


def listS3Objects(bucket, prefix=None):
    # Create S3 bucket client
    s3 = boto3.client('s3', region_name=MOVIE_APP_REGION_NAME)

    try:
        response = s3.list_objects(
            Bucket=bucket,
            Prefix=prefix,
        )
        return response["Contents"]
    except ClientError as error:
        print("Bucket: %s" % (bucket))
        print("Error listing object: %s" % (error))


def convertToStringColumn(csv_object):
    for col in csv_object:
        if (csv_object[col].dtypes == 'object'):
            try:
                csv_object[col].apply(literal_eval)
                csv_object[col] = csv_object[col].apply(
                    json.dumps).astype('string')
                csv_object[col] = csv_object[col].replace(
                    to_replace=r'\\', value='', regex=True)
            except:
                pass
    return csv_object


def uploadDataToDynamoDB(pd_object, db_table, partition_key):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(db_table)
        pd_object = pd_object.drop_duplicates(subset=partition_key)
        with table.batch_writer() as batch:
            for index, row in pd_object.iterrows():
                batch.put_item(Item=json.loads(row.to_json()))
    except Exception as e:
        print("Error uploading data to dynamodb: ", e)
        print("Table: ", db_table)
        return e


def uploadCsvToS3d(file_path, bucket, pd_object):
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
