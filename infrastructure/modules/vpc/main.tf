locals {
  len_public_subnets = length(var.public_subnets)
  available_az_zones = data.aws_availability_zones.available.names
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "this" {
  cidr_block           = var.main_vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${var.service}-vpc"
  }
}

resource "aws_subnet" "public" {
  count             = local.len_public_subnets
  availability_zone = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) > 0 ? element(var.azs, count.index) : element(local.available_az_zones, count.index)
  cidr_block        = element(concat(var.public_subnets, [""]), count.index)
  vpc_id            = aws_vpc.this.id
  tags = {
    Name = "${var.service}-public-subnet-b"
  }
}



resource "aws_internet_gateway" "movie_app" {
  vpc_id = aws_vpc.this.id
  tags = {
    Name = "${var.service}-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.movie_app.id
  }
  tags = {
    Name = "${var.service}-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  count = local.len_public_subnets

  subnet_id      = element(aws_subnet.public[*].id, count.index)
  route_table_id = aws_route_table.public.id
}
