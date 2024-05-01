output "vpc_id" {
  description = "The ID of the VPC"
  value       = try(aws_vpc.this.id, null)
}

output "vpc_arn" {
  description = "The ARN of the VPC"
  value       = try(aws_vpc.this.arn, null)
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "public_subnet_arns" {
  description = "List of ARNs of public subnets"
  value       = aws_subnet.public[*].arn
}

output "public_subnets_cidr_blocks" {
  description = "List of cidr_blocks of public subnets"
  value       = compact(aws_subnet.public[*].cidr_block)
}

