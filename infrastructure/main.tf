data "aws_caller_identity" "current" {}

// Route53 Hosted zones 
data "aws_route53_zone" "this" {
  name         = var.root_domain_name
  private_zone = false
}

##################################################
# VPC
##################################################

module "vpc" {
  source         = "./modules/vpc"
  service        = var.service
  main_vpc_cidr  = var.main_vpc_cidr
  public_subnets = var.public_subnets
  azs            = ["ap-southeast-1a", "ap-southeast-1b"]
}

##################################################
# Lambda network config & IAM role
##################################################
module "movie_app_lambda" {
  source                    = "./modules/lambda"
  service                   = var.service
  vpc_id                    = module.vpc.vpc_id
  movie_app_sns_arn         = module.movie_app_sns.movie_app_sns_arn
  fargate_security_group_id = module.movie_app_fargate.fargate_security_group_id
}

module "movie_app_sns" {
  source             = "./modules/sns"
  region             = var.region
  name               = var.sns_name
  source_bucket_id   = module.movie_csv_source_bucket.s3_bucket_id
  source_bucket_arn  = module.movie_csv_source_bucket.s3_bucket_arn
  current_iam_caller = data.aws_caller_identity.current
}

##################################################
# S3 Buckets
##################################################
module "movie_csv_source_bucket" {
  source      = "./modules/s3"
  bucket      = var.movie_csv_source_bucket
  allow_read  = true
  allow_write = true
}

module "movie_csv_processed_bucket" {
  source = "./modules/s3"
  bucket = var.movie_csv_processed_bucket
}

module "movie_serverless_bucket" {
  source = "./modules/s3"
  bucket = var.movie_serverless_bucket
}

##################################################
# Cloudfront with S3 Buckets
##################################################
module "acm" {
  source      = "./modules/acm"
  domain_name = var.acm_domain_name
  zone_id     = data.aws_route53_zone.this.zone_id
  subject_alternative_names = [
    var.movie_app_bucket
  ]
}
module "movie_app_bucket" {
  source = "./modules/s3"
  bucket = var.movie_app_bucket
}

module "movie_app_www_bucket" {
  source               = "./modules/s3"
  bucket               = var.movie_app_www_bucket
  allow_cloudfront_oac = true
  cors_rule = [
    {
      allowed_methods = ["GET"]
      allowed_origins = ["*"]
    }

    #  {
    #   allowed_methods = ["PUT", "POST"]
    #   allowed_origins = ["https://${var.movie_app_www_bucket}"]
    #   allowed_headers = ["*"]
    #   expose_headers  = ["ETag"]
    #   max_age_seconds = 3000
    #   }
  ]
  cloudfront_distribution_arn = module.movie_app_www_cloudfront.cloudfront_distribution_arn
}

module "movie_app_www_cloudfront" {
  source                       = "./modules/cloudfront"
  create_origin_access_control = true
  create_route_53_record       = true
  zone_id                      = data.aws_route53_zone.this.zone_id
  default_root_object          = "index.html"
  aliases                      = ["${var.movie_app_www_bucket}"]
  http_version                 = "http2and3"
  origin_access_control = {
    s3_oac = {
      description      = "CloudFront access to S3"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  origin = {
    s3_oac = {
      domain_name           = module.movie_app_www_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "s3_oac"
    }
  }


  default_cache_behavior = {
    target_origin_id       = "s3_oac"
    viewer_protocol_policy = "redirect-to-https"
    // ID can be found in https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
  }

  custom_error_response = [{
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
    }, {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }]

  geo_restriction = {
    restriction_type = "none"
  }

  viewer_certificate = {
    acm_certificate_arn      = module.acm.acm_certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_cloudfront_function" "redirct" {
  name    = "redirctUrl"
  runtime = "cloudfront-js-2.0"
  comment = "Redirct non www url to www url"
  publish = true
  code    = file("${path.root}/functions/redirectUrl.ts")
}

module "movie_app_cloudfront" {
  source                       = "./modules/cloudfront"
  create_origin_access_control = false
  create_route_53_record       = true
  zone_id                      = data.aws_route53_zone.this.zone_id
  aliases                      = ["${var.movie_app_bucket}"]
  http_version                 = "http2and3"

  origin = {
    s3_oac = {
      domain_name           = module.movie_app_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "s3_oac"
    }
  }


  default_cache_behavior = {
    target_origin_id       = "s3_oac"
    viewer_protocol_policy = "redirect-to-https"
    // ID can be found in https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    function_association = {
      viewer-request = {
        function_arn = aws_cloudfront_function.redirct.arn

      }
    }
  }

  geo_restriction = {
    restriction_type = "none"
  }

  viewer_certificate = {
    acm_certificate_arn      = module.acm.acm_certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

##################################################
# Athena & Glue
##################################################
module "movie_app_athena" {
  source                          = "./modules/athena-glue"
  movie_app_database_buckets_name = module.movie_csv_processed_bucket.s3_bucket_id
  glue_database_name              = var.service
  glue_crawlers_list              = var.glue_crawlers_list
}

module "movie_app_fargate" {
  source                              = "./modules/fargate"
  service                             = var.service
  vpc_id                              = module.vpc.vpc_id
  movie_csv_processed_bucket_arn      = module.movie_csv_processed_bucket.s3_bucket_arn
  movie_csv_source_bucket_arn         = module.movie_csv_source_bucket.s3_bucket_arn
  movie_similarity_dynamodb_table_arn = module.movie_similarity_table.dynamodb_table_arn
}

module "movie_app_cognito" {
  source   = "./modules/cognito"
  app_name = var.user_pool_name
}

module "movie_app_api" {
  source                           = "./modules/api-domain"
  movie_app_api_domain_name        = var.movie_app_api_domain_name
  movie_app_domain_certificate_arn = module.acm.acm_certificate_arn
  zone_id                          = data.aws_route53_zone.this.zone_id
}

module "movie_similarity_table" {
  source   = "./modules/dynamoDB"
  name     = var.movie_similarity_table_name
  hash_key = "movieId"
  attributes = [{
    name = "movieId"
    type = "N"
    }, {
    name = "index"
    type = "N"
  }]

  global_secondary_indexes = [
    {
      hash_key        = "index"
      name            = "getIndex"
      projection_type = "ALL"
    }
  ]
}

module "movie_user_selection_table" {
  source   = "./modules/dynamoDB"
  name     = var.user_selection_table_name
  hash_key = "email"
  attributes = [{
    name = "email"
    type = "S"
  }]
}

module "movie_app_github_action" {
  source             = "./modules/github-action"
  current_iam_caller = data.aws_caller_identity.current
  region             = var.region
  service            = var.service
}
