#ALB security group
resource "aws_security_group" "alb" {
  name   = "alb-security-group"
  description = "Security group for Application Load Balancer traffic"
  vpc_id = var.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "alb_protocol" {
  for_each = var.alb_ports

  security_group_id = aws_security_group.alb.id

  ip_protocol = "tcp"
  from_port   = each.value.from_port
  to_port     = each.value.to_port
  cidr_ipv4   = "0.0.0.0/0"
}

#allow outbound traffic
resource "aws_vpc_security_group_egress_rule" "alb_outbound" {
  security_group_id = aws_security_group.alb.id

  ip_protocol = "-1" #allow all network protocols
  cidr_ipv4 = "0.0.0.0/0" #all ips on the internet
}

#ECS security group
resource "aws_security_group" "ecs" {
    name = "ecs-security-group"
    vpc_id = var.vpc.id
}

#allow only alb to ecs container traffic
resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb"{
    security_group_id = aws_security_group.ecs.id

    ip_protocol = "tcp"
    from_port = 3000
    to_port = 3000
    referenced_security_group_id =  aws_security_group.alb.id
}

#allow ecs task to access the internet
resource "aws_vpc_security_group_egress_rule" "ecs_outbound" {
  security_group_id = aws_security_group.alb.id

  ip_protocol = "-1"
  cidr_ipv4 = "0.0.0.0/0"
}