locals {
  service    = var.service
  account_id = var.current_iam_caller.account_id
  region     = var.region
}

resource "aws_iam_role" "github_actions_ci" {
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  description        = "Role assumed by the GitHub OIDC provider."
  name               = "${local.service}-github-action-ci"
  path               = "/"
}


resource "aws_iam_policy" "github_actions_ci" {
  name = "${local.service}-github-action-ci"
  path = "/"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cloudformation:DescribeStacks",
          "cloudformation:DeleteChangeSet",
          "cloudformation:CreateChangeSet",
          "cloudformation:DescribeChangeSet",
          "cloudformation:ExecuteChangeSet",
          "cloudformation:DescribeStackEvents",
          "cloudformation:ListStackResources"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:cloudformation:${local.region}:${local.account_id}:stack/movie-app-*/*"
      },
      {
        Action = [
          "cloudformation:ValidateTemplate",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ecr:GetAuthorizationToken",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:DescribeImages"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ecr:${local.region}:${local.account_id}:repository/serverless-movie-app-fargate-dev"
      },
      {
        "Action" : [
          "ecs:TagResource",
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:ecs:${local.region}:${local.account_id}:task-definition/*"
      },
      {
        "Action" : [
          "ecs:RegisterTaskDefinition",
          "ecs:DeregisterTaskDefinition"
        ],
        "Effect" : "Allow",
        "Resource" : "*"
      },
      {
        "Action" : [
          "ecs:DescribeClusters",
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:ecs:${local.region}:${local.account_id}:cluster/movie-app-fargate-dev-*"
      },

      {
        "Action" : [
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "ecs:CreateService",
          "ecs:DeleteService"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:ecs:${local.region}:${local.account_id}:service/movie-app-fargate-dev-*"
      },
      {
        "Action" : [
          "iam:PassRole"
        ],
        "Effect" : "Allow",
        "Resource" : [
          "${var.fargate_task_role_arn}",
          "arn:aws:iam::${local.account_id}:role/movie-app-*"
        ]
      },
      {
        "Action" : [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:s3:::movie-app-serverless-bucket"
      },
      {
        "Action" : [
          "s3:GetObject",
          "s3:PutObject",
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:s3:::movie-app-serverless-bucket/*"
      },
      {
        "Action" : [
          "lambda:PublishLayerVersion",
          "lambda:GetLayerVersion",
          "lambda:DeleteLayerVersion"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:lambda:${local.region}:${local.account_id}:layer:movie-app-*"
        }, {
        "Action" : [
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:PublishVersion",
          "lambda:ListTags",
          "lambda:ListVersionsByFunction"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:lambda:${local.region}:${local.account_id}:function:movie-app-*"
      },
      {
        "Action" : [
          "iam:GetRole"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:iam::${local.account_id}:role/movie-app-*"
      },
      {
        "Action" : [
          "events:DescribeRule"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:events:${local.region}:${local.account_id}:rule/movie-app-*"
      },

    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_ci" {
  policy_arn = aws_iam_policy.github_actions_ci.arn
  role       = aws_iam_role.github_actions_ci.name
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}
