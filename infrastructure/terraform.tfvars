# Root variables
region  = "ap-southeast-1"
service = "movie-app"

# App variables value
root_domain_name          = "paohenghsu.com"
acm_domain_name           = "*.movieapp.paohenghsu.com"
movie_app_api_domain_name = "api.movieapp.paohenghsu.com"


# VPC variable value
main_vpc_cidr  = "10.0.0.0/24"
public_subnets = ["10.0.0.0/26", "10.0.0.128/26"]

# SNS variable value 
sns_name = "movie-app-s3-triggered-event"

# S3 buckets variable value
movie_csv_source_bucket    = "movie-app-csv-source-bucket"
movie_csv_processed_bucket = "movie-app-csv-processed-bucket"
movie_serverless_bucket    = "movie-app-serverless-bucket"
movie_app_www_bucket       = "www.movieapp.paohenghsu.com"
movie_app_bucket           = "movieapp.paohenghsu.com"

# Athena & Glue
glue_crawlers_list = {
  credits = {
    name = "credits-csv"
    path = "csv/credits"
  }

  movies = {
    name = "movies-csv"
    path = "csv/movies"
  }

  similarity = {
    name = "similarity-csv"
    path = "csv/similarity"
  }
}

# Cognito
user_pool_name = "movie-app-user-pool"

# DynamoDB
movie_similarity_table_name = "movie-similarity"
user_selection_table_name   = "user-selection"

