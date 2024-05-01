variable "main_vpc_cidr" {
  type        = string
  description = "Main VPC CIDR value"
}

variable "service" {
  type        = string
  description = "Name of the project"
}

variable "public_subnets" {
  description = "A list of public subnets inside the VPC"
  type        = list(string)
  default     = []
}

variable "azs" {
  description = "A list of availability zones names or ids in the region"
  type        = list(string)
  default     = []
}
