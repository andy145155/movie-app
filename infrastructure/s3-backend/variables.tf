variable "service" {
  type    = string
  default = "movie-app-terraform-s3-backend"
}

variable "bucket" {
  description = "The name of the bucket to put the file in. Alternatively, an S3 access point ARN can be specified."
  type        = string
  default     = "movie-app-terraform-s3-backend"
}

variable "region" {
  type    = string
  default = "ap-southeast-1"
}
