variable "create_origin_access_control" {
  description = "Controls if CloudFront origin access control should be created"
  type        = bool
  default     = false
}

variable "create_route_53_record" {
  description = "Controls if CloudFront route53 record should be created"
  type        = bool
  default     = false
}

variable "zone_id" {
  description = "The ID of the hosted zone to contain this record. Required when validating via Route53"
  type        = string
  default     = ""
}

variable "create_distribution" {
  description = "Controls if CloudFront distribution should be created"
  type        = bool
  default     = true
}

variable "origin_access_control" {
  description = "Map of CloudFront origin access control"
  type = map(object({
    description      = string
    origin_type      = string
    signing_behavior = string
    signing_protocol = string
  }))

  default = {
    s3 = {
      description      = "",
      origin_type      = "s3",
      signing_behavior = "always",
      signing_protocol = "sigv4"
    }
  }
}

variable "origin" {
  description = "One or more origins for this distribution (multiples allowed)."
  type        = any
  default     = null
}

variable "enabled" {
  description = "Whether the distribution is enabled to accept end user requests for content."
  type        = bool
  default     = true
}

variable "default_root_object" {
  description = "The object that you want CloudFront to return (for example, index.html) when an end user requests the root URL."
  type        = string
  default     = null
}

variable "aliases" {
  description = "Extra CNAMEs (alternate domain names), if any, for this distribution."
  type        = list(string)
  default     = null
}

variable "default_cache_behavior" {
  description = "The default cache behavior for this distribution"
  type        = any
  default     = null
}

variable "ordered_cache_behavior" {
  description = "An ordered list of cache behaviors resource for this distribution. List from top to bottom in order of precedence. The topmost cache behavior will have precedence 0."
  type        = any
  default     = []
}

variable "http_version" {
  description = "The maximum HTTP version to support on the distribution. Allowed values are http1.1, http2, http2and3, and http3. The default is http2."
  type        = string
  default     = "http2"
}

variable "custom_error_response" {
  description = "One or more custom error response elements"
  type        = any
  default     = {}
}

variable "function_association" {
  description = "Cloudfront function association"
  type        = any
  default     = {}
}

variable "viewer_certificate" {
  description = "The SSL configuration for this distribution"
  type        = any
  default = {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1"
  }
}

variable "geo_restriction" {
  description = "The restriction configuration for this distribution (geo_restrictions)"
  type        = any
  default     = {}
}
