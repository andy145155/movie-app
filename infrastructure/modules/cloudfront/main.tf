
locals {
  create_origin_access_control = var.create_origin_access_control && length(keys(var.origin_access_control)) > 0
  create_route_53_record       = var.create_route_53_record && var.zone_id != "" && length(var.aliases) > 0
}

resource "aws_cloudfront_origin_access_control" "this" {
  for_each = local.create_origin_access_control ? var.origin_access_control : {}

  name = each.key

  description                       = each.value["description"]
  origin_access_control_origin_type = each.value["origin_type"]
  signing_behavior                  = each.value["signing_behavior"]
  signing_protocol                  = each.value["signing_protocol"]
}

resource "aws_cloudfront_distribution" "this" {
  count               = var.create_distribution ? 1 : 0
  enabled             = var.enabled
  default_root_object = var.default_root_object
  aliases             = var.aliases
  http_version        = var.http_version
  dynamic "origin" {
    for_each = var.origin

    content {
      domain_name              = origin.value.domain_name
      origin_id                = lookup(origin.value, "origin_id", origin.key)
      origin_path              = lookup(origin.value, "origin_path", "")
      origin_access_control_id = lookup(origin.value, "origin_access_control_id", lookup(lookup(aws_cloudfront_origin_access_control.this, lookup(origin.value, "origin_access_control", ""), {}), "id", null))
    }
  }

  dynamic "default_cache_behavior" {
    for_each = [var.default_cache_behavior]
    iterator = i

    content {
      target_origin_id       = i.value["target_origin_id"]
      viewer_protocol_policy = i.value["viewer_protocol_policy"]

      allowed_methods = lookup(i.value, "allowed_methods", ["GET", "HEAD", "OPTIONS"])
      cached_methods  = lookup(i.value, "cached_methods", ["GET", "HEAD"])
      compress        = lookup(i.value, "compress", null)

      cache_policy_id = try(i.value.cache_policy_id, data.aws_cloudfront_cache_policy.this[i.value.cache_policy_name].id, null)

      dynamic "function_association" {
        for_each = lookup(i.value, "function_association", [])
        iterator = f

        content {
          event_type   = f.key
          function_arn = f.value.function_arn
        }
      }

    }
  }

  dynamic "custom_error_response" {
    for_each = length(flatten([var.custom_error_response])[0]) > 0 ? flatten([var.custom_error_response]) : []

    content {
      error_code = custom_error_response.value["error_code"]

      response_code         = lookup(custom_error_response.value, "response_code", null)
      response_page_path    = lookup(custom_error_response.value, "response_page_path", null)
      error_caching_min_ttl = lookup(custom_error_response.value, "error_caching_min_ttl", null)
    }
  }

  restrictions {
    dynamic "geo_restriction" {
      for_each = [var.geo_restriction]

      content {
        restriction_type = lookup(geo_restriction.value, "restriction_type", "none")
        locations        = lookup(geo_restriction.value, "locations", [])
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn            = lookup(var.viewer_certificate, "acm_certificate_arn", null)
    cloudfront_default_certificate = lookup(var.viewer_certificate, "cloudfront_default_certificate", null)
    iam_certificate_id             = lookup(var.viewer_certificate, "iam_certificate_id", null)

    minimum_protocol_version = lookup(var.viewer_certificate, "minimum_protocol_version", "TLSv1")
    ssl_support_method       = lookup(var.viewer_certificate, "ssl_support_method", null)
  }


}

resource "aws_route53_record" "movie_app_www_domain" {
  count   = local.create_route_53_record ? 1 : 0
  zone_id = var.zone_id
  name    = var.aliases[0]
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.this[0].domain_name
    zone_id                = aws_cloudfront_distribution.this[0].hosted_zone_id
    evaluate_target_health = false
  }
}
