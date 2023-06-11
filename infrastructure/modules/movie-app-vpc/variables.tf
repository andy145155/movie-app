variable "main_vpc_cidr" {
  type        = string
  description = "Main VPC CIDR value"
}
variable "public_subnet_a" {
  type        = string
  description = "CIDR value for public subnet a"
}
variable "private_subnet_a" {
  type        = string
  description = "CIDR value for private subnet a"
}
variable "public_subnet_b" {
  type        = string
  description = "CIDR value for public subnet b"
}
variable "private_subnet_b" {
  type        = string
  description = "CIDR value for private subnet b"
}
variable "service" {
  type        = string
  description = "Name of the project"
}
