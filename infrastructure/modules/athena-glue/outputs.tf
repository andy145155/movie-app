output "glue_crawler_name" {
  value = {
    for k, crawler in aws_glue_crawler.this : k => crawler.name
  }
}
