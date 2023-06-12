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

    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    csv_name = event['Records'][0]['s3']['object']['key']

    try:
        if csv_name in S3_DATABASE_FILE_PATH.values():
            for crawler_name, file_path in S3_DATABASE_FILE_PATH.items():
                if csv_name == file_path:
                    triggerGlueCrawler(GLUE_CRAWLER[crawler_name])
                    print(
                        f"Successfully triggered {GLUE_CRAWLER[crawler_name]}")
                    break
        else:
            raise Exception("Unknown input object")
    except Exception as error:
        print("Error triggering the glue crawlers: %s" % error)

    return
