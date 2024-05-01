
output "cloudfront_origin_access_controls" {
  description = "The origin access controls created"
  value       = local.create_origin_access_control ? { for k, v in aws_cloudfront_origin_access_control.this : k => v } : {}
}

output "cloudfront_origin_access_controls_ids" {
  description = "The IDS of the origin access identities created"
  value       = local.create_origin_access_control ? [for v in aws_cloudfront_origin_access_control.this : v.id] : []
}

output "cloudfront_distribution_arn" {
  description = "The ARN (Amazon Resource Name) for the distribution."
  value       = try(aws_cloudfront_distribution.this[0].arn, "")
}
