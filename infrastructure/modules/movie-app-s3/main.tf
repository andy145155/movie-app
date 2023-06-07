resource "aws_s3_bucket" "movie_app_buckets" {
  count  = length(var.s3_bucket_names)
  bucket = var.s3_bucket_names[count.index]
}

resource "aws_s3_bucket_public_access_block" "movie_app_buckets" {
  count  = length(var.s3_bucket_names)
  bucket = aws_s3_bucket.movie_app_buckets[count.index].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_vpc_endpoint" "movie_app_buckets" {
  vpc_id            = var.vpc_id
  vpc_endpoint_type = "Gateway"
  service_name      = "com.amazonaws.${var.region}.s3"
  route_table_ids = [
    var.private_route_table_id
  ]
  private_dns_enabled = false

  tags = {
    Name = "Movie app s3 gateway endpoint"
  }
}

resource "aws_vpc_endpoint_policy" "movie_app_buckets" {
  vpc_endpoint_id = aws_vpc_endpoint.movie_app_buckets.id
  count           = length(var.s3_bucket_names)
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Principal" : "*",
        "Action" : [
          "s3:GetObject",
          "s3:GetBucketPolicy",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ],
        "Effect" : "Allow",
        "Resource" : ["*"],
      }
    ]
  })
}


resource "aws_vpc_endpoint_route_table_association" "gw_endpoint_rt_association" {
  route_table_id  = var.private_route_table_id
  vpc_endpoint_id = aws_vpc_endpoint.movie_app_buckets.id
}

resource "aws_s3_bucket_policy" "movie_app_bucket_policy" {
  bucket = aws_s3_bucket.movie_app_buckets[count.index].id
  count  = length(var.s3_bucket_names)
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "movie-app-bucket-policy",
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject",
          "s3:GetBucketPolicy",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ],
        "Resource" : [
          "${aws_s3_bucket.movie_app_buckets[count.index].arn}",
          "${aws_s3_bucket.movie_app_buckets[count.index].arn}/*"
        ],
        "Principal" : {
          "AWS" : "${var.current_iam_caller.account_id}"
        },
        "Condition" : {
          "StringEquals" : {
            "aws:sourceVpce" : "${aws_vpc_endpoint.movie_app_buckets.id}",
          },
        }
      }
    ]
  })
}
