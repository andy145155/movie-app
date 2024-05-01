# https://developer.hashicorp.com/terraform/language/settings/backends/s3

locals {
  service     = var.service
  bucket_name = var.bucket
}

resource "aws_s3_bucket" "terraform_backend" {
  bucket = local.bucket_name

  tags = {
    Name = "${local.service}"
  }
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.terraform_backend.id
  versioning_configuration {
    status = "Enabled"
  }
}
