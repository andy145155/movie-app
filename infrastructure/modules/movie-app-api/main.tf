// To use an ACM certificate with CloudFront, region us-east-1 is required.
provider "aws" {
  alias  = "acm"
  region = "us-east-1"
}

data "aws_acm_certificate" "movie＿app_api_ssl_certificate" {
  provider = aws.acm
  domain   = var.acm_domain_name
  statuses = ["ISSUED"]
}

data "aws_route53_zone" "movie_app_zone" {
  name = var.root_domain_name
}

resource "aws_api_gateway_domain_name" "example" {
  certificate_arn = data.aws_acm_certificate.movie＿app_api_ssl_certificate.arn
  domain_name     = var.movie_app_api_domain_name
}


resource "aws_route53_record" "movie_app_api_domain" {
  name    = aws_api_gateway_domain_name.example.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.movie_app_zone.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.example.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.example.cloudfront_zone_id
  }
}
