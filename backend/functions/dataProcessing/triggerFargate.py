try:
    import unzip_requirements
except ImportError:
    pass

import boto3
import os
import json
from utils.apiFunctions import getInfoFromSNS, listS3Objects, checkLambdaWarmUp
from utils.constants import TMDB_5000_CSV


def handler(event, context):
    print(event)
    if checkLambdaWarmUp(event):
        return "Lambda is warmed"

    bucket, key = getInfoFromSNS(event)
    print(bucket)

    s3_objects = listS3Objects(bucket, prefix=TMDB_5000_CSV["PREFIX"])
    print(s3_objects)

    required_files = {TMDB_5000_CSV["CREDITS"], TMDB_5000_CSV["MOVIES"]}
    if not all(s3_object["Key"] in required_files for s3_object in s3_objects):
        missing_files = required_files - \
            {s3_object["Key"] for s3_object in s3_objects}
        return f"The following files are missing: {', '.join(missing_files)}"

    client = boto3.client('ecs')
    clusters_list = listClusters(client)
    print(clusters_list)

    movie_app_cluster = findClusterArn(
        clusters_list, os.environ["CLUSTER_PREFIX"])
    if movie_app_cluster is None:
        print(
            f"Error finding cluster arn with prefix {os.environ['CLUSTER_PREFIX']}")

    task_definitions_list = listTaskDefinitions(
        client, os.environ["TASK_DEF_PREFIX"])
    print(task_definitions_list)

    movie_app_task_definition = findTaskDefinitionArn(
        task_definitions_list, os.environ["TASK_DEF_PREFIX"])
    if movie_app_task_definition is None:
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


def findClusterArn(clusters_list, prefix):
    for cluster in clusters_list:
        if prefix in cluster:
            print("Cluster arn found: ", cluster)
            return cluster
    return None


def findTaskDefinitionArn(task_definitions_list, prefix):
    for task_definition in task_definitions_list:
        if prefix in task_definition:
            print("Task definition arn found: ", task_definition)
            return task_definition
    return None


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
