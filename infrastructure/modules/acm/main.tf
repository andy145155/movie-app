locals {
  validation_domains = distinct(
    [for k, v in aws_acm_certificate.this.domain_validation_options : merge(
      tomap(v), { domain_name = replace(v.domain_name, "*.", "") }
    )]
  )

  distinct_domain_names = distinct(
    [for s in concat([var.domain_name], var.subject_alternative_names) : replace(s, "*.", "")]
  )
}

resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = var.validation_method

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "validation" {
  count = length(local.distinct_domain_names)

  zone_id = var.zone_id
  name    = element(local.validation_domains, count.index)["resource_record_name"]
  type    = element(local.validation_domains, count.index)["resource_record_type"]
  ttl     = var.dns_ttl

  records = [
    element(local.validation_domains, count.index)["resource_record_value"]
  ]

  allow_overwrite = var.validation_allow_overwrite_records

  depends_on = [aws_acm_certificate.this]
}

resource "aws_acm_certificate_validation" "this" {

  certificate_arn = aws_acm_certificate.this.arn

  validation_record_fqdns = flatten([aws_route53_record.validation[*].fqdn, var.validation_record_fqdns])

}
