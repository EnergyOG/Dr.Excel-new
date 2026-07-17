variable "vpc_id" {
  type = number
}

variable "alb_ports" {
  description = "Ports allowed for ALB inbound traffic"

  type = map(object({
    from_port = number
    to_port   = number
  }))

  default = {
    http = {
      from_port = 80
      to_port   = 80
    }
    https = {
      from_port = 443
      to_port   = 443
    }
  }
}