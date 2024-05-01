locals {
  app_name = var.app_name
}

resource "aws_cognito_user_pool" "this" {

  name                     = local.app_name
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_uppercase = true
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  lifecycle {
    ignore_changes = [
      schema
    ]
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = local.app_name
  user_pool_id = aws_cognito_user_pool.this.id
}
