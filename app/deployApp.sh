#!/bin/bash

set -e

ROOT_FOLDER="$(readlink -f $(pwd)/../)"
CONFIG_FOLDER_GLOBAL=$(readlink -f "$ROOT_FOLDER/infrastructure")
BUILD_DATETIME=$(date +'%Y-%m-%d-%T')
echo "Build movie-app-webpage-$BUILD_DATETIME"
BUCKET_NAME=$(jq -r '.movie_app_bucket_www_name' "$CONFIG_FOLDER_GLOBAL/config.json")
DISTRIBUTION_ID=$(jq -r '.movie_app_www_distribution_id' "$CONFIG_FOLDER_GLOBAL/config.json")

yarn

aws s3 sync ./build/ "s3://$BUCKET_NAME"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"