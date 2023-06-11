data "aws_iam_policy_document" "lambda_trust_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "${var.service}-LambdaExecuteRole"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust_policy.json
}

data "aws_iam_policy_document" "lambda_exec_policy" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",

      # NOTE: Below 3 *NetworkInterface* rules are necessary per described in https://docs.aws.amazon.com/lambda/latest/dg/vpc.html
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",

      "s3:GetObject",
      "s3:GetBucketPolicy",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:ListBucket",
      "s3:GetBucketLocation",

      "glue:StartCrawler",
      "glue:GetTable",
      "glue:GetDatabase",

      "ecs:ListTaskDefinitions",
      "ecs:ListClusters",
      "ecs:RunTask",

      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",

      "iam:PassRole",

      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:BatchGetItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]

    resources = ["*", ]
  }
}

resource "aws_iam_policy" "iam_policy_for_lambda" {

  name        = "aws_iam_policy_for_terraform_aws_lambda_role"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy      = data.aws_iam_policy_document.lambda_exec_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
}

resource "aws_security_group" "lambda" {
  vpc_id = var.vpc_id
  name   = "${var.service}-lambda"
  tags = {
    Name = "${var.service}-lambda-security-group"
  }
}

resource "aws_security_group_rule" "eg_gateway_egress" {
  description       = "Outbound traffic from Lambda to ECS Tasks"
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda.id
}
