output "movie_app_sns_arn" {
  value = aws_sns_topic.this.arn
}
output "movie_app_sns_name" {
  value = aws_sns_topic.this.name
}
