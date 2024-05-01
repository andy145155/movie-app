output "acm_certificate_arn" {
  description = "The ARN of the certificate"
  value       = try(aws_acm_certificate_validation.this.certificate_arn, aws_acm_certificate.this.arn, "")
}

output "validation_route53_record_fqdns" {
  description = "List of FQDNs built using the zone domain and name."
  value       = aws_route53_record.validation[*].fqdn
}

output "distinct_domain_names" {
  description = "List of distinct domains names used for the validation."
  value       = local.distinct_domain_names
}

output "validation_domains" {
  description = "List of distinct domain validation options. This is useful if subject alternative names contain wildcards."
  value       = local.validation_domains
}
