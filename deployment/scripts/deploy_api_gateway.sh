#!/bin/bash
set -e
CWD=$(pwd)

CONFIG_FOLDER_APP=$(readlink -f "./deployment/resources")
API_ID=$(jq -r '.ApiId' "$CONFIG_FOLDER_APP/sls.api.json")
echo "Deploy $component ($stage) API"
aws apigateway create-deployment --region ap-southeast-1 --rest-api-id $API_ID --stage-name v1
