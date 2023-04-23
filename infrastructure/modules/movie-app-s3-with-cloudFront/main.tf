provider "aws" {
  alias  = "acm"
  region = "us-east-1"
}

resource "aws_s3_bucket" "movie_app_www_bucket" {
  bucket = var.movie_app_www_domain_name
}

resource "aws_s3_bucket" "movie_app_bucket" {
  bucket = var.movie_app_root_domain_name
}

resource "aws_s3_bucket_acl" "movie_app_www_bucket" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_acl" "movie_app_bucket" {
  bucket = aws_s3_bucket.movie_app_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "movie_app_www_bucket" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_website_configuration" "movie_app_bucket" {
  bucket = aws_s3_bucket.movie_app_bucket.id
  redirect_all_requests_to {
    host_name = var.movie_app_www_domain_name
    protocol  = "https"
  }
}

resource "aws_s3_bucket_cors_configuration" "example" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["https://${var.movie_app_www_domain_name}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}
resource "aws_s3_bucket_policy" "www_bucket_policy" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "PublicReadGetObject",
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : ["s3:GetObject"],
        "Resource" : ["arn:aws:s3:::${var.movie_app_www_domain_name}/*"]
      }
  ] })
}

data "aws_acm_certificate" "movie＿app_ssl_certificate" {
  provider = aws.acm
  domain   = var.movie_app_www_domain_name
  statuses = ["ISSUED"]
}

data "aws_route53_zone" "movie_app_zone" {
  name = var.root_domain_name
}

resource "aws_route53_record" "movie_app_www_domain" {
  zone_id = data.aws_route53_zone.movie_app_zone.zone_id
  name    = var.movie_app_www_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.movie_app_www_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.movie_app_www_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "movie_app_domain" {
  zone_id = data.aws_route53_zone.movie_app_zone.zone_id
  name    = var.movie_app_root_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.movie_app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.movie_app_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_distribution" "movie_app_www_distribution" {

  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
    domain_name = aws_s3_bucket_website_configuration.movie_app_www_bucket.website_endpoint
    origin_id   = var.movie_app_www_domain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.movie_app_www_domain_name
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = ["${var.movie_app_www_domain_name}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.movie＿app_ssl_certificate.arn
    ssl_support_method  = "sni-only"
  }
}

resource "aws_cloudfront_distribution" "movie_app_distribution" {

  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
    domain_name = aws_s3_bucket_website_configuration.movie_app_bucket.website_endpoint
    origin_id   = var.movie_app_root_domain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.movie_app_root_domain_name
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = ["${var.movie_app_root_domain_name}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.movie＿app_ssl_certificate.arn
    ssl_support_method  = "sni-only"
  }
}
