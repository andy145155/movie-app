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

resource "aws_cloudfront_origin_access_control" "movie_app_www_domain" {
  name                              = "movie-app-www-domain-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "www_bucket_policy" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowCloudFrontServicePrincipalReadOnly",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "cloudfront.amazonaws.com"
        },
        "Action" : "s3:GetObject",
        "Resource" : ["${aws_s3_bucket.movie_app_www_bucket.arn}/*"],
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceArn" : ["${aws_cloudfront_distribution.movie_app_www_distribution.arn}"]
          }
        }
      }
  ] })
}

resource "aws_s3_bucket_policy" "root_bucket_policy" {
  bucket = aws_s3_bucket.movie_app_bucket.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowCloudFrontServicePrincipalReadOnly",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "cloudfront.amazonaws.com"
        },
        "Action" : "s3:GetObject",
        "Resource" : ["${aws_s3_bucket.movie_app_bucket.arn}/*"],
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceArn" : ["${aws_cloudfront_distribution.movie_app_distribution.arn}"]
          }
        }
      }
  ] })
}

resource "aws_s3_bucket_public_access_block" "movie_app_www_domain" {
  bucket = aws_s3_bucket.movie_app_www_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_acm_certificate" "movie_app_www_ssl_certificate" {
  provider = aws.acm
  domain   = var.acm_domain_name
  statuses = ["ISSUED"]
}

data "aws_acm_certificate" "movie_app_ssl_certificate" {
  provider = aws.acm
  domain   = var.movie_app_root_domain_name
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_function" "redirct" {
  name    = "redirctUrl"
  runtime = "cloudfront-js-1.0"
  comment = "Redirct non www url to www url"
  publish = true
  code    = file("${path.root}/functions/redirectUrl.ts")
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
    domain_name              = aws_s3_bucket.movie_app_www_bucket.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.movie_app_www_bucket.bucket
    origin_access_control_id = aws_cloudfront_origin_access_control.movie_app_www_domain.id
  }


  enabled             = true
  default_root_object = "index.html"
  aliases             = ["${var.movie_app_www_domain_name}"]

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

  custom_error_response {
    error_code         = 404
    response_page_path = "/index.html"
    response_code      = 200
  }

  custom_error_response {
    error_code         = 403
    response_page_path = "/index.html"
    response_code      = 200
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.movie_app_www_ssl_certificate.arn
    ssl_support_method  = "sni-only"
  }
}


resource "aws_cloudfront_distribution" "movie_app_distribution" {
  origin {
    domain_name              = aws_s3_bucket.movie_app_bucket.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.movie_app_bucket.bucket
    origin_access_control_id = aws_cloudfront_origin_access_control.movie_app_www_domain.id
  }

  enabled = true
  aliases = ["${var.movie_app_root_domain_name}"]

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.movie_app_root_domain_name
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirct.arn
    }

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.movie_app_ssl_certificate.arn
    ssl_support_method  = "sni-only"
  }
}

