resource "aws_sns_topic" "movie_app_topic" {
  name              = var.sns_name
  kms_master_key_id = "alias/aws/sns"
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [{
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "s3.amazonaws.com"
        },
        "Action" : "SNS:Publish",
        "Resource" : ["arn:aws:sns:${var.region}:${var.current_iam_caller.account_id}:${var.sns_name}"],
        "Condition" : {
          "ArnLike" : { "aws:SourceArn" : "${var.movie_app_csv_buckets_arn}" }
        }
      }]
  })
}

resource "aws_s3_bucket_notification" "movie_app_s3_notif" {
  bucket = var.movie_app_csv_buckets_id
  topic {
    topic_arn = aws_sns_topic.movie_app_topic.arn
    events = [
      "s3:ObjectCreated:*",
    ]
  }
}
