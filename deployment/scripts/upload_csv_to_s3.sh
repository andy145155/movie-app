#!/bin/bash
set -e

CONFIG_FOLDER=$(readlink -f "$(pwd)/infrastructure/")

BUCKET_NAME=$(jq -r '.movie_csv_source_bucket_name' "$CONFIG_FOLDER/appResources.json")

echo "Bucket name: $BUCKET_NAME"

CSV_FOLDER=$(readlink -f "$(pwd)/csv/")

if [ -d "$CSV_FOLDER" ]; then
  cd $CSV_FOLDER

  for filename in *.csv; do
    aws s3 cp $filename s3://$BUCKET_NAME/$filename
  done
fi
