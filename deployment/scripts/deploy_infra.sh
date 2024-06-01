#!/bin/bash
set -u

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