################################################################################
# VPC
################################################################################
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_arn" {
  description = "The ARN of the VPC"
  value       = module.vpc.vpc_arn
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "public_subnet_arns" {
  description = "List of ARNs of public subnets"
  value       = module.vpc.public_subnet_arns
}

output "public_subnets_cidr_blocks" {
  description = "List of cidr_blocks of public subnets"
  value       = module.vpc.public_subnets_cidr_blocks
}

################################################################################
# Lambda
################################################################################

output "lambda_iam_role_arn" {
  value = module.movie_app_lambda.lambda_iam_role_arn
}

output "lambda_security_group_id" {
  value = module.movie_app_lambda.lambda_security_group_id
}

################################################################################
# S3 Bucket
################################################################################

output "movie_csv_source_bucket_name" {
  value = module.movie_csv_source_bucket.s3_bucket_id
}

output "movie_csv_processed_bucket_name" {
  value = module.movie_csv_processed_bucket.s3_bucket_id
}

output "movie_serverless_bucket_name" {
  value = module.movie_serverless_bucket.s3_bucket_id
}

################################################################################
# SNS
################################################################################

output "movie_app_sns_arn" {
  value = module.movie_app_sns.movie_app_sns_arn
}
output "movie_app_sns_name" {
  value = module.movie_app_sns.movie_app_sns_name
}

################################################################################
# Fargate
################################################################################
output "fargate_security_group_id" {
  value = module.movie_app_fargate.fargate_security_group_id
}

################################################################################
# CloudFront & S3 
# ################################################################################
output "movie_app_bucket_www_name" {
  value = module.movie_app_www_bucket.s3_bucket_id
}

output "movie_app_www_distribution_id" {
  value = module.movie_app_www_cloudfront.cloudfront_distribution_arn
}


################################################################################
# Cognito
################################################################################

output "movie_app_user_pool_id" {
  value = module.movie_app_cognito.movie_app_user_pool_id
}
output "movie_app_user_pool_arn" {
  value = module.movie_app_cognito.movie_app_user_pool_arn
}

output "movie_app_user_pool_client_id" {
  value = module.movie_app_cognito.movie_app_user_pool_client_id
}

################################################################################
# DynamoDB
################################################################################

output "movie_similarity_table_name" {
  value = module.movie_similarity_table.dynamodb_table_id
}

output "movie_user_selection_name" {
  value = module.movie_user_selection_table.dynamodb_table_id
}

################################################################################
# Glue & Athena
################################################################################

output "movie_app_glue_crawlers_name" {
  value = module.movie_app_athena.glue_crawler_name
}
