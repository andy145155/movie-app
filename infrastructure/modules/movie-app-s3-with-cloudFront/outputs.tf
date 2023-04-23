output "movie_app_bucket_www_name" {
  value = aws_s3_bucket.movie_app_www_bucket.bucket
}

output "movie_app_www_distribution_id" {
  value = aws_cloudfront_distribution.movie_app_www_distribution.id
}
