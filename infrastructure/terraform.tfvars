# Root variables
region  = "ap-southeast-1"
service = "movie-app"

# VPC variable value
main_vpc_cidr    = "10.0.0.0/24"
public_subnet_a  = "10.0.0.0/26"
public_subnet_b  = "10.0.0.64/26"
private_subnet_a = "10.0.0.128/26"
private_subnet_b = "10.0.0.192/26"

# SNS variable value 
sns_name = "movie-app-s3-triggered-event"

# S3 buckets variable value
s3_bucket_names = ["movie-app-csv-bucket", "movie-app-athena-database"]


# IAM variable value
db_user = "user-movie-app"

# S3 app variables value
movie_app_www_domain_name  = "www.movieapp.paohenghsu.com"
movie_app_root_domain_name = "movieapp.paohenghsu.com"
root_domain_name           = "paohenghsu.com"
acm_domain_name            = "*.movieapp.paohenghsu.com"


# API variables value
movie_app_api_domain_name = "api.movieapp.paohenghsu.com"
