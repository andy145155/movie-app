output "movie_app_csv_buckets_id" {
  value = aws_s3_bucket.movie_app_buckets[0].id
}

output "movie_app_csv_buckets_arn" {
  value = aws_s3_bucket.movie_app_buckets[0].arn
}

output "movie_app_database_buckets_name" {
  value = aws_s3_bucket.movie_app_buckets[1].bucket
}

output "movie_app_database_buckets_arn" {
  value = aws_s3_bucket.movie_app_buckets[1].arn
}
