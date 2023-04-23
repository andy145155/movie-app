'''
This function will trigger a Glue Crawler when an S3 event is detected.
'''

try:
    import unzip_requirements
except ImportError:
    pass
from utils.apiFunctions import triggerGlueCrawler, checkLambdaWarmUp
from utils.constants import S3_DATABASE_FILE_PATH, GLUE_CRAWLER


def handler(event, context):
    print(event)

    # Check if the Lambda function is already warmed up
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    # Get the name of the CSV file
    csv_name = event['Records'][0]['s3']['object']['key']

    try:
        # Trigger the appropriate Glue Crawler based on the CSV file name
        if csv_name == S3_DATABASE_FILE_PATH["CREDITS"]:
            triggerGlueCrawler(GLUE_CRAWLER["CREDITS"])
            print(
                f"""Successfully triggered {GLUE_CRAWLER["CREDITS"]}""")
        elif csv_name == S3_DATABASE_FILE_PATH["MOVIES"]:
            triggerGlueCrawler(GLUE_CRAWLER["MOVIES"])
            print(
                f"""Successfully triggered {GLUE_CRAWLER["MOVIES"]}""")
        elif csv_name == S3_DATABASE_FILE_PATH["SIMILARITY"]:
            triggerGlueCrawler(GLUE_CRAWLER["SIMILARITY"])
            print(
                f"""Successfully triggered {GLUE_CRAWLER["SIMILARITY"]}""")
        else:
            # Raise an exception if the CSV file name is unknown
            raise Exception("Unknown input object")
    except Exception as error:
        print("Error triggering the glue crawlers: %s" % (error))

    return
