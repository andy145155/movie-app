#!/bin/bash
set -e

# Check if number of arguments is 1
if [ "$#" -ne 1 ]; then
	echo "./generate_runtime_layer_zip.sh requirements.txt"
	echo "Example:"
	echo "./generate_runtime_layer_zip.sh ../publisher"
	exit 1
fi

DIR=$1
PACKAGE_JSON_PATH="$1/requirements.txt"
if [ ! -f $PACKAGE_JSON_PATH ]; then
	echo "requirements.txt not found!"
	exit 1
fi

echo "Process $PACKAGE_JSON_PATH"

cd $DIR

echo $pwd
if [ -d 'layers' ]; then
  rm -rf layers
fi

# # https://docs.aws.amazon.com/en_us/lambda/latest/dg/configuration-layers.html#configuration-layers-path
pip install -t layers/python/lib/python3.11/site-packages --platform manylinux2014_aarch64 --only-binary=:all: --upgrade --python-version 3.11 --implementation cp -r requirements.txt