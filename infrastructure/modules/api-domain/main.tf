resource "aws_api_gateway_domain_name" "this" {
  certificate_arn = var.movie_app_domain_certificate_arn
  domain_name     = var.movie_app_api_domain_name
}


resource "aws_route53_record" "movie_app_api_domain" {
  name    = aws_api_gateway_domain_name.this.domain_name
  type    = "A"
  zone_id = var.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.this.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.this.cloudfront_zone_id
  }
}
