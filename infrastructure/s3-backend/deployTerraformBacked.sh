#!/bin/bash
set -eu

# Remove the .terraform directory if it exists
if [ -d ".terraform" ]; then
  rm -r .terraform
fi

# Format the Terraform files
terraform fmt -recursive

# Initialize Terraform
terraform init

# Apply the Terraform configuration
terraform apply