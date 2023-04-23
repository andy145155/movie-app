output "movie_app_sns_arn" {
  value = aws_sns_topic.movie_app_topic.arn
}
output "movie_app_sns_name" {
  value = aws_sns_topic.movie_app_topic.name
}
