variable "region" {}
variable "source_bucket_arn" {}
variable "source_bucket_id" {}
variable "current_iam_caller" {}

variable "name" {
  description = "The name of the SNS topic to create"
  type        = string
  default     = null
}
