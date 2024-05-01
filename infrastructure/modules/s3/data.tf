data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "this" {
  source_policy_documents = compact([
    var.allow_read ? data.aws_iam_policy_document.read.json : "",
    var.allow_write ? data.aws_iam_policy_document.write.json : "",
    var.allow_cloudfront_oac && var.cloudfront_distribution_arn != null ? data.aws_iam_policy_document.cloudfront_oac.json : "",
  ])
}

data "aws_iam_policy_document" "read" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:GetBucketPolicy",
      "s3:GetBucketLocation",
    ]

    resources = [
      "${aws_s3_bucket.this.arn}/*",
      "${aws_s3_bucket.this.arn}"
    ]

    principals {
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
      type        = "AWS"
    }
  }
}

data "aws_iam_policy_document" "write" {
  statement {
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]

    resources = [
      "${aws_s3_bucket.this.arn}/*",
      "${aws_s3_bucket.this.arn}"
    ]

    principals {
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
      type        = "AWS"
    }
  }
}

data "aws_iam_policy_document" "cloudfront_oac" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.this.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [var.cloudfront_distribution_arn != null ? var.cloudfront_distribution_arn : ""]
    }
  }
}

