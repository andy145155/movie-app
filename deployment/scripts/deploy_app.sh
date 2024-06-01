#!/bin/bash
set -e

echo "Build movie-app"
CONFIG_FOLDER_APP=$(readlink -f "./deployment/resources")
BUCKET_NAME=$(jq -r '.movie_app_bucket_www_name' "$CONFIG_FOLDER_APP/terraform.resources.json")
echo $BUCKET_NAME
DISTRIBUTION_ID=$(jq -r '.movie_app_www_distribution_id' "$CONFIG_FOLDER_APP/terraform.resources.json")
echo $DISTRIBUTION_ID

MOVIE_APP_DIRECTORY=$(readlink -f "app")
if [ -d "$MOVIE_APP_DIRECTORY" ]; then
  cd $MOVIE_APP_DIRECTORY
  yarn
  yarn build

  # copy from the custom-element/main dir to to s3 sub-dir
  DIST_DIR="$MOVIE_APP_DIRECTORY/dist"

  # NOTE: Never update js map containing source codes to buckets
  aws s3 cp $DIST_DIR s3://$BUCKET_NAME/ --include "*" --exclude "*.html" --exclude "*.js.map" --recursive --metadata-directive REPLACE --cache-control max-age=900
  aws s3 cp $DIST_DIR s3://$BUCKET_NAME/ --exclude "*" --include "*.html" --recursive --metadata-directive REPLACE --cache-control "max-age=0, must-revalidate"


  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths="/*"
fi
