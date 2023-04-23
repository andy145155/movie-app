provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

module "movie_app_vpc" {
  source           = "./modules/movie-app-vpc"
  main_vpc_cidr    = var.main_vpc_cidr
  public_subnet_a  = var.public_subnet_a
  private_subnet_a = var.private_subnet_a
  public_subnet_b  = var.public_subnet_b
  private_subnet_b = var.private_subnet_b
  dns_support      = var.dns_support
  dns_hostnames    = var.dns_hostnames
  state            = var.state
  service          = var.service

}

module "movie_app_lambda" {
  source                    = "./modules/movie-app-lambda"
  service                   = var.service
  vpc_id                    = module.movie_app_vpc.vpc_id
  movie_app_sns_arn         = module.movie_app_sns.movie_app_sns_arn
  fargate_security_group_id = module.movie_app_fargate.fargate_security_group_id
}

module "movie_app_s3" {
  source                 = "./modules/movie-app-s3"
  service                = var.service
  region                 = var.region
  s3_bucket_names        = var.s3_bucket_names
  movie_app_bucket_acl   = var.movie_app_bucket_acl
  vpc_id                 = module.movie_app_vpc.vpc_id
  current_iam_caller     = data.aws_caller_identity.current
  private_route_table_id = module.movie_app_vpc.private_route_table_id
}

module "movie_app_sns" {
  source                    = "./modules/movie-app-sns"
  region                    = var.region
  service                   = var.service
  movie_app_csv_buckets_id  = module.movie_app_s3.movie_app_csv_buckets_id
  movie_app_csv_buckets_arn = module.movie_app_s3.movie_app_csv_buckets_arn
  current_iam_caller        = data.aws_caller_identity.current
  sns_name                  = var.sns_name
}

module "movie_app_athena" {
  source                          = "./modules/movie-app-athena"
  movie_app_database_buckets_name = module.movie_app_s3.movie_app_database_buckets_name
  vpc_id                          = module.movie_app_vpc.vpc_id
  service                         = var.service
}

module "movie_app_fargate" {
  source  = "./modules/movie-app-fargate"
  service = var.service
  vpc_id  = module.movie_app_vpc.vpc_id
}

module "movie_app_s3_app" {
  source                     = "./modules/movie-app-s3-with-cloudFront"
  movie_app_www_domain_name  = var.movie_app_www_domain_name
  movie_app_root_domain_name = var.movie_app_root_domain_name
  root_domain_name           = var.root_domain_name
}

module "movie_app_cognito" {
  source = "./modules/movie-app-cognito"
}

module "movie_app_api" {
  source                    = "./modules/movie-app-api"
  root_domain_name          = var.root_domain_name
  movie_app_api_domain_name = var.movie_app_api_domain_name
}

module "movie_app_dynamo" {
  source = "./modules/movie-app-dynamoDB"
}
