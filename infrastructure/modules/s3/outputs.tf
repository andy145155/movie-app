output "s3_bucket_id" {
  description = "The name of the bucket."
  value       = try(aws_s3_bucket.this.id, "")
}

output "s3_bucket_arn" {
  description = "The ARN of the bucket."
  value       = try(aws_s3_bucket.this.arn, "")
}

output "s3_bucket_bucket_regional_domain_name" {
  description = "The bucket region-specific domain name. The bucket domain name including the region name, please refer here for format. Note: The AWS CloudFront allows specifying S3 region-specific endpoint when creating S3 origin, it will prevent redirect issues from CloudFront to S3 Origin URL."
  value       = try(aws_s3_bucket.this.bucket_regional_domain_name, "")
}
