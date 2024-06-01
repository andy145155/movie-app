#!/bin/bash
set -e
CWD=$(pwd)
# export AWS_PROFILE=main

component=${COMPONENT}

if [ -z "$component" ] || [ "$component" = "triggered-tasks" ]; then
  bash ./deployment/scripts/generate_runtime_layer.sh ./backend/triggered-tasks
  cd $CWD/backend/triggered-tasks/
  sls deploy
fi

if [ -z "$component" ] || [ "$component" = "api" ]; then
  bash ./deployment/scripts/generate_runtime_layer.sh ./backend/api
  cd $CWD/backend/api/
  sls deploy
fi

if [ -z "$component" ] || [ "$component" = "fargate" ]; then
  cd $CWD/backend/fargate/
  sls deploy
fi

