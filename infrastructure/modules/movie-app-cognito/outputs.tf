output "movie_app_user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "movie_app_user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "movie_app_user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

