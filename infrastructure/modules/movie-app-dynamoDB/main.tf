resource "aws_dynamodb_table" "movie_similarity_table" {
  name         = "movies_similarity"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "movieId"

  attribute {
    name = "movieId"
    type = "N"
  }

  attribute {
    name = "index"
    type = "N"
  }

  global_secondary_index {
    hash_key        = "index"
    name            = "getIndex"
    projection_type = "ALL"
  }

}

resource "aws_dynamodb_table" "movie_user_selection_table" {
  name         = "user_selection"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }

}

resource "aws_vpc_endpoint" "movie_app_dynamo_db" {
  vpc_id            = var.vpc_id
  vpc_endpoint_type = "Gateway"
  service_name      = "com.amazonaws.${var.region}.dynamodb"
  route_table_ids = [
    var.private_route_table_id
  ]
  private_dns_enabled = false

  tags = {
    Name = "Movie app dynamoDB gateway endpoint"
  }
}

resource "aws_vpc_endpoint_policy" "dynamoDB_endpoint_policy" {
  vpc_endpoint_id = aws_vpc_endpoint.movie_app_dynamo_db.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Principal" : "*",
        "Action" : ["*"],
        "Effect" : "Allow",
        "Resource" : ["*"],
      }
    ]
  })
}

resource "aws_vpc_endpoint_route_table_association" "gw_endpoint_rt_association" {
  route_table_id  = var.private_route_table_id
  vpc_endpoint_id = aws_vpc_endpoint.movie_app_dynamo_db.id
}
