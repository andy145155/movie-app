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
variable "public_subnet_a" {
  type        = string
  description = "CIDR value for public subnet a"
}
variable "private_subnet_a" {
  type        = string
  description = "CIDR value for private subnet a"
}
variable "public_subnet_b" {
  type        = string
  description = "CIDR value for public subnet b"
}
variable "private_subnet_b" {
  type        = string
  description = "CIDR value for private subnet b"
}

# SNS variables
variable "sns_name" {
  type        = string
  description = "Name of the SNS topic"
}

# S3 buckets variables
variable "s3_bucket_names" {
  type        = list(any)
  description = "List of s3 bucket names"
}


# IAM variables 
variable "db_user" {}

# S3 App variables
variable "movie_app_www_domain_name" {}
variable "movie_app_root_domain_name" {}
variable "root_domain_name" {}
variable "acm_domain_name" {}

# API variables
variable "movie_app_api_domain_name" {}
