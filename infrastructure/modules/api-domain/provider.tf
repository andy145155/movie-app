// To use an ACM certificate with CloudFront, region us-east-1 is required.
provider "aws" {
  alias  = "acm"
  region = "us-east-1"
}
