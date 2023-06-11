try:
    import unzip_requirements
except ImportError:
    pass
import boto3
from utils.apiFunctions import getInfoFromSNS, listS3Objects, checkLambdaWarmUp
from utils.constants import TMDB_5000_CSV
import os
import json


def handler(event, context):
    print(event)
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    bucket, key = getInfoFromSNS(event)
    print(bucket)

    s3_objects = listS3Objects(bucket, prefix=TMDB_5000_CSV["PREFIX"])
    print(s3_objects)

    count = 0
    # Can write better
    for s3_object in s3_objects:
        if s3_object["Key"] in {TMDB_5000_CSV["CREDITS"], TMDB_5000_CSV["MOVIES"]}:
            count += 1
    if count != 2:
        return f"""${TMDB_5000_CSV["CREDITS"]} or ${TMDB_5000_CSV["MOVIES"]} does not exits"""

    client = boto3.client('ecs')
    clusters_list = listClusters(client)
    print(clusters_list)

    # Get movie_app_cluster from cluster_list
    try:
        movie_app_cluster = next(
            cluster for cluster in clusters_list if os.environ["CLUSTER_PREFIX"] in cluster)
        print("Cluster arn found: ", movie_app_cluster)
    except StopIteration:
        print(
            f"Error finding cluster arn with prefix {os.environ['CLUSTER_PREFIX']}")

    task_definitions_list = listTaskDefinitions(
        client, os.environ["TASK_DEF_PREFIX"])
    print(task_definitions_list)

   # Get movie_app_task_definition from task_definitions_list
    try:
        movie_app_task_definition = next(
            task_definition for task_definition in task_definitions_list if os.environ["TASK_DEF_PREFIX"] in task_definition)
        print("Task definition arn found: ", movie_app_task_definition)
    except StopIteration:
        print(
            f"Error finding task definition arn with prefix {os.environ['TASK_DEF_PREFIX']}")

    print(movie_app_task_definition)
    print(movie_app_cluster)
    response = runTask(client, cluster=movie_app_cluster,
                       task_definition=movie_app_task_definition)
    print(response)
    return response


def listClusters(client):
    response = client.list_clusters()
    print(response)
    return response["clusterArns"]


def listTaskDefinitions(client, prefix=None):
    response = client.list_task_definitions(
        familyPrefix=prefix
    )
    return response["taskDefinitionArns"]


def runTask(client, cluster, task_definition):
    response = client.run_task(
        cluster=cluster,
        count=1,
        launchType='FARGATE',
        networkConfiguration={
            'awsvpcConfiguration': {
                'subnets': [
                    os.environ["PRIVATE_SUBNET_A_ID"],
                    os.environ["PRIVATE_SUBNET_B_ID"]
                ],
                'securityGroups': [
                    os.environ["FARGATE_SG_ID"]
                ]
            }
        },
        taskDefinition=task_definition
    )

    return json.dumps(response, default=str)
