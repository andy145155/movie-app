resource "aws_sns_topic" "this" {
  name              = var.name
  kms_master_key_id = aws_kms_alias.topic_key_alias.name
}

resource "aws_sns_topic_policy" "this" {
  arn    = aws_sns_topic.this.arn
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }

    actions = ["SNS:Publish"]

    resources = ["arn:aws:sns:${var.region}:${var.current_iam_caller.account_id}:${var.name}"]

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"

      values = [
        "${var.source_bucket_arn}"
      ]
    }
  }
}

resource "aws_s3_bucket_notification" "movie_app_s3_notif" {
  bucket = var.source_bucket_id
  topic {
    topic_arn = aws_sns_topic.this.arn
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
    // TODO: Allow only var.source_bucket_arn and aws_sns_topic.this.arn
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
