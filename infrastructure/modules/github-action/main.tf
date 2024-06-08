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
        Action   = "cloudformation:DescribeStacks"
        Effect   = "Allow"
        Resource = "arn:aws:cloudformation:${local.region}:${local.account_id}:stack/movie-app-*/*"
      }
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
