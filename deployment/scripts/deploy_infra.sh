#!/bin/bash
set -u
CWD=$(pwd)

# Infrastructure directory
INFRA_DIRCETORY=$CWD/infrastructure

# Check if the infrastructure directory exists
if [ ! -d "$INFRA_DIRCETORY" ]; then
  echo "The infrastructure directory does not exist"
  exit 1
fi

# Change to the infrastructure directory
cd $INFRA_DIRCETORY

if [ -d ".terraform" ]; then
  rm -r .terraform
fi

terraform fmt -recursive
terraform init -backend-config=backend-config.conf
terraform apply -state="terraform.tfstate"

DEPLOYMENT_RESOURCES_FOLDER="$(readlink -f $(pwd)/../deployment/resources)"

RETVAL=$?
if [ ${RETVAL} -eq 0 ]; then
  terraform output  -json | jq "to_entries| map({(.key): .value.value}) | add" > $DEPLOYMENT_RESOURCES_FOLDER/terraform.resources.json
fi