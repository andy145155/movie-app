locals {
  glue_role_name   = "glue_role"
  glue_policy_name = "glue-s3-policy"
}

resource "aws_glue_catalog_database" "this" {
  name = var.glue_database_name
}

resource "aws_glue_crawler" "this" {
  for_each = var.glue_crawlers_list

  name          = each.value.name
  role          = aws_iam_role.this.arn
  database_name = aws_glue_catalog_database.this.name
  classifiers   = [aws_glue_classifier.csv_classifier.id]
  s3_target {
    path = "s3://${var.movie_app_database_buckets_name}/${each.value.path}"
  }
}

resource "aws_glue_classifier" "csv_classifier" {
  name = "csv-classifier"

  csv_classifier {
    contains_header        = "PRESENT"
    delimiter              = ","
    disable_value_trimming = false
    quote_symbol           = "\""
  }
}

resource "aws_iam_role" "this" {
  name               = local.glue_role_name
  assume_role_policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["glue.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "glue_s3_policy" {
  name   = local.glue_policy_name
  policy = data.aws_iam_policy_document.glue_s3_policy_document.json

}

data "aws_iam_policy_document" "glue_s3_policy_document" {
  statement {
    actions = [
      "s3:GetBucketLocation",
      "s3:ListBucket",
      "s3:ListAllMyBuckets",
      "s3:GetBucketAcl",
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = [
      "arn:aws:s3:::${var.movie_app_database_buckets_name}",
      "arn:aws:s3:::${var.movie_app_database_buckets_name}/*"
    ]
  }
}

resource "aws_iam_role_policy_attachment" "glue_s3_policy_attachment" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.glue_s3_policy.arn
}


resource "aws_iam_role_policy_attachment" "glue_service_role_attachment" {
  role       = aws_iam_role.this.name
  policy_arn = data.aws_iam_policy.AWSGlueServiceRole.arn
}

data "aws_iam_policy" "AWSGlueServiceRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}

