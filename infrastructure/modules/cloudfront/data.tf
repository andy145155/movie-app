data "aws_cloudfront_cache_policy" "this" {
  for_each = toset([for v in concat([var.default_cache_behavior], var.ordered_cache_behavior) : v.cache_policy_name if can(v.cache_policy_name)])

  name = each.key
}
