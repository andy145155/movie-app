
resource "aws_security_group" "ecs_task" {
  name   = "${var.service}-ecs"
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.service}-ecs-security-group"
  }
}

resource "aws_security_group_rule" "ig_gateway_ingress" {
  description       = "Internet gateway Ingress"
  type              = "ingress"
  security_group_id = aws_security_group.ecs_task.id
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ig_gateway_egress" {
  description       = "Internet Gateway Egress"
  type              = "egress"
  security_group_id = aws_security_group.ecs_task.id
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}
