# Root variables
variable "region" {
  description = "AWS region"
  type        = string
}
variable "service" {
  type        = string
  description = "Name of the project"
}


# VPC variables
variable "main_vpc_cidr" {
  type        = string
  description = "Main VPC CIDR value"
}
variable "public_subnets" {
  description = "A list of public subnets inside the VPC"
  type        = list(string)
  default     = []
}

# SNS variables
variable "sns_name" {
  type        = string
  description = "Name of the SNS topic"
}

# S3 buckets variables
variable "movie_csv_source_bucket" {
  type = string
}
variable "movie_csv_processed_bucket" {
  type = string
}

variable "movie_serverless_bucket" {
  type = string
}

variable "movie_app_bucket" {
  type = string
}

variable "movie_app_www_bucket" {
  type = string
}


# IAM variables 
variable "db_user" {}

# S3 App variables
variable "root_domain_name" {}
variable "acm_domain_name" {}

# API variables
variable "movie_app_api_domain_name" {}

# Athena & Glue
variable "glue_crawlers_list" {}

# Cognito
variable "user_pool_name" {}
