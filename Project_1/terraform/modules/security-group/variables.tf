variable "vpc_id" {
  type = string
}

variable "alb_ports" {
  description = "Ports allowed for ALB inbound traffic"
  type = map(object({
    from_port = number
    to_port   = number
  }))
}

variable "container_port" {
  description = "Port allows ECS tasks to receive ALB traffic"
  type = number
}
