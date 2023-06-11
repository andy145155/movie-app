resource "aws_glue_catalog_database" "movie_app_input_csv" {
  name = "input-csv"
}

resource "aws_glue_crawler" "credits_csv_crawler" {
  database_name = aws_glue_catalog_database.movie_app_input_csv.name
  name          = "input-credits-csv-crawler"
  role          = aws_iam_role.glue_role.arn
  classifiers   = [aws_glue_classifier.csv_classifier.id]
  s3_target {
    path = "s3://${var.movie_app_database_buckets_name}/csv/credits"
  }
}

resource "aws_glue_crawler" "movies_csv_crawler" {
  database_name = aws_glue_catalog_database.movie_app_input_csv.name
  name          = "input-movies-csv-crawler"
  role          = aws_iam_role.glue_role.arn
  classifiers   = [aws_glue_classifier.csv_classifier.id]
  s3_target {
    path = "s3://${var.movie_app_database_buckets_name}/csv/movies"
  }
}

resource "aws_glue_crawler" "similarity_csv_crawler" {
  database_name = aws_glue_catalog_database.movie_app_input_csv.name
  name          = "input-similarity-csv-crawler"
  role          = aws_iam_role.glue_role.arn
  classifiers   = [aws_glue_classifier.csv_classifier.id]
  s3_target {
    path = "s3://${var.movie_app_database_buckets_name}/csv/similarity"
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

resource "aws_iam_role" "glue_role" {
  name               = "glue_role"
  assume_role_policy = data.aws_iam_policy_document.glue_assume_role_policy.json
}

data "aws_iam_policy_document" "glue_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["glue.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "glue_s3_policy" {
  name   = "glue-s3-policy"
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
  role       = aws_iam_role.glue_role.name
  policy_arn = aws_iam_policy.glue_s3_policy.arn
}


resource "aws_iam_role_policy_attachment" "glue_service_role_attachment" {
  role       = aws_iam_role.glue_role.name
  policy_arn = data.aws_iam_policy.AWSGlueServiceRole.arn
}

data "aws_iam_policy" "AWSGlueServiceRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}

