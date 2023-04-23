output "fargate_security_group_id" {
  value = aws_security_group.ecs_task.id
}
