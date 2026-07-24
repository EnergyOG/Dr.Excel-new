variable "region" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "azs" {
  type = list(string)
}

variable "public_subnets" {
  type = list(string)
}

variable "private_subnets" {
  type = list(string)
}

variable "enable_dns_support" {
  type = bool
}

variable "enable_dns_hostnames" {
  type = bool
}

variable "enable_nat_gateway" {
  type = bool
}

variable "one_nat_gateway_per_az" {
  type = bool
}

variable "tags" {
  type = map(string)
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
  type        = number
}

variable "project_name" {
  type = string
}