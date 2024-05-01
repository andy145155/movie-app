#!/bin/bash
set -u

if [ -d ".terraform" ]; then
  rm -r .terraform
fi

terraform fmt -recursive
terraform init -backend-config=backend-config.conf
terraform apply -state="terraform.tfstate"

RETVAL=$?
if [ ${RETVAL} -eq 0 ]; then
  terraform output  -json | jq "to_entries| map({(.key): .value.value}) | add" > appResources.json
  jq -r '
  "REACT_APP_COGNITO_CLIENT_ID=\(.movie_app_user_pool_client_id)",
  "REACT_APP_COGNITO_USER_POOL_ID=\(.movie_app_user_pool_id)"' appResources.json > ../app/.env
fi