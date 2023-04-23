#!/bin/bash
terraform init
terraform apply
terraform output -json | jq "to_entries| map({(.key): .value.value}) | add" > config.json
jq -r '
"REACT_APP_COGNITO_CLIENT_ID=\(.movie_app_user_pool_client_id)",
"REACT_APP_COGNITO_USER_POOL_ID=\(.movie_app_user_pool_id)"' config.json > ../app/.env
