variable "service" {}
variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}
variable "movie_csv_source_bucket_arn" {
  type    = string
  default = ""
}
variable "movie_csv_processed_bucket_arn" {
  type    = string
  default = ""
}

variable "movie_similarity_dynamodb_table_arn" {
  type    = string
  default = ""
}
