variable "bucket" {
  description = "(Optional, Forces new resource) The name of the bucket. If omitted, Terraform will assign a random, unique name."
  type        = string
  default     = null
}

variable "block_public_acls" {
  description = "Whether Amazon S3 should block public ACLs for this bucket."
  type        = bool
  default     = true
}

variable "block_public_policy" {
  description = "Whether Amazon S3 should block public bucket policies for this bucket."
  type        = bool
  default     = true
}

variable "ignore_public_acls" {
  description = "Whether Amazon S3 should ignore public ACLs for this bucket."
  type        = bool
  default     = true
}

variable "restrict_public_buckets" {
  description = "Whether Amazon S3 should restrict public bucket policies for this bucket."
  type        = bool
  default     = true
}

variable "allow_read" {
  description = "Controls if S3 bucket should have read policy attached"
  type        = bool
  default     = true
}

variable "allow_write" {
  description = "Controls if S3 bucket should have write policy attached"
  type        = bool
  default     = true
}

variable "allow_cloudfront_oac" {
  description = "Controls if S3 bucket should have cloudfront OAC policy attached"
  type        = bool
  default     = false
}

variable "cloudfront_distribution_arn" {
  description = "The ARN for the cloudfront distribution."
  type        = string
  default     = null
}

variable "cors_rule" {
  description = "List of maps containing rules for Cross-Origin Resource Sharing."
  type        = any
  default     = []
}
