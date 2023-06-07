# VPC Outputs
output "vpc_id" {
  value = module.movie_app_vpc.vpc_id
}
output "public_subnet_a_id" {
  value = module.movie_app_vpc.public_subnet_a_id
}
output "public_subnet_b_id" {
  value = module.movie_app_vpc.public_subnet_b_id
}
output "private_subnet_a_id" {
  value = module.movie_app_vpc.private_subnet_a_id
}
output "private_subnet_b_id" {
  value = module.movie_app_vpc.private_subnet_b_id
}
# Lambda Outputs
output "lambda_iam_role_arn" {
  value = module.movie_app_lambda.lambda_iam_role_arn
}

output "lambda_security_group_id" {
  value = module.movie_app_lambda.lambda_security_group_id
}

# S3 Outputs
output "movie_app_csv_buckets_id" {
  value = module.movie_app_s3.movie_app_csv_buckets_id
}

output "movie_app_csv_buckets_arn" {
  value = module.movie_app_s3.movie_app_csv_buckets_arn
}

output "movie_app_database_buckets_name" {
  value = module.movie_app_s3.movie_app_database_buckets_name
}

output "movie_app_database_buckets_arn" {
  value = module.movie_app_s3.movie_app_database_buckets_arn
}

# SNS Outputs
output "movie_app_sns_arn" {
  value = module.movie_app_sns.movie_app_sns_arn
}
output "movie_app_sns_name" {
  value = module.movie_app_sns.movie_app_sns_name
}

# Fargate Outputs
output "fargate_security_group_id" {
  value = module.movie_app_fargate.fargate_security_group_id
}

# S3 and CloudFront Outputs

output "movie_app_bucket_www_name" {
  value = module.movie_app_s3_app.movie_app_bucket_www_name
}

output "movie_app_www_distribution_id" {
  value = module.movie_app_s3_app.movie_app_www_distribution_id
}


# Cognito Outputs

output "movie_app_user_pool_id" {
  value = module.movie_app_cognito.movie_app_user_pool_id
}
output "movie_app_user_pool_arn" {
  value = module.movie_app_cognito.movie_app_user_pool_arn
}

output "movie_app_user_pool_client_id" {
  value = module.movie_app_cognito.movie_app_user_pool_client_id
}

