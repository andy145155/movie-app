
resource "aws_security_group" "this" {
  name   = "${var.service}-ecs"
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.service}-ecs-security-group"
  }
}

resource "aws_security_group_rule" "ig_gateway_ingress" {
  description       = "Internet gateway Ingress"
  type              = "ingress"
  security_group_id = aws_security_group.this.id
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ig_gateway_egress" {
  description       = "Internet Gateway Egress"
  type              = "egress"
  security_group_id = aws_security_group.this.id
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}
#------------------------------------------------------------------------------
# AWS ECS Task Role
#------------------------------------------------------------------------------

data "aws_iam_policy_document" "fargate_task_role" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket"
    ]

    resources = [
      "${var.movie_csv_source_bucket_arn}",
      "${var.movie_csv_source_bucket_arn}/*",
      "${var.movie_csv_processed_bucket_arn}",
      "${var.movie_csv_processed_bucket_arn}/*",
    ]
  }

  statement {
    effect = "Allow"

    actions = ["dynamodb:PutItem", "dynamodb:BatchWriteItem"]

    resources = ["${var.movie_similarity_dynamodb_table_arn}"]
  }
}

resource "aws_iam_policy" "fargate_task_role" {
  name   = "FargateTaskRolePolicy"
  path   = "/"
  policy = data.aws_iam_policy_document.fargate_task_role.json
}

data "aws_iam_policy_document" "fargate_trust_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.fargate_task_role.name
  policy_arn = aws_iam_policy.fargate_task_role.arn
}

resource "aws_iam_role" "fargate_task_role" {
  name               = "${var.service}-FargateTaskRole"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.fargate_trust_policy.json
}
