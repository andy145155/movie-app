resource "aws_dynamodb_table" "movie_similarity_table" {
  name           = "movies_similarity"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "movieId"

  attribute {
    name = "movieId"
    type = "N"
  }

}

resource "aws_dynamodb_table" "movie_user_selection_table" {
  name           = "user_selection"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

}
