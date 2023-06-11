resource "aws_sns_topic" "movie_app_topic" {
  name              = var.sns_name
  kms_master_key_id = aws_kms_alias.topic_key_alias.name
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

resource "aws_kms_key" "topic_key" {
  description = "SNS Topic Key"
  policy      = data.aws_iam_policy_document.topic_key_kms_policy.json
}

data "aws_iam_policy_document" "topic_key_kms_policy" {
  statement {
    effect = "Allow"
    principals {
      identifiers = ["s3.amazonaws.com"]
      type        = "Service"
    }
    principals {
      identifiers = ["sns.amazonaws.com"]
      type        = "Service"
    }
    actions = [
      "kms:GenerateDataKey",
      "kms:Decrypt"
    ]
    // TODO: Allow only var.movie_app_csv_buckets_arn and aws_sns_topic.movie_app_topic.arn
    resources = ["*"]
  }
  # allow root user to administrate key
  statement {
    effect = "Allow"
    principals {
      identifiers = ["arn:aws:iam::${var.current_iam_caller.account_id}:root"]
      type        = "AWS"
    }
    actions = [
      "kms:*"
    ]
    resources = ["*"]
  }
}

resource "aws_kms_alias" "topic_key_alias" {
  name          = "alias/topic-key"
  target_key_id = aws_kms_key.topic_key.key_id
}
