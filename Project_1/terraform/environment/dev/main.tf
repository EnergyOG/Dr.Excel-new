module "vpc" {
  source = "../../modules/vpc"

  vpc_name = var.vpc_name
  vpc_cidr = var.vpc_cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_dns_support   = var.enable_dns_support
  enable_dns_hostnames = var.enable_dns_hostnames

  enable_nat_gateway     = var.enable_nat_gateway
  one_nat_gateway_per_az = var.one_nat_gateway_per_az

  tags = var.tags
}

module "security_group" {
  source = "../../modules/security-group"

  project_name = var.project_name
  vpc_id = module.vpc.vpc_id
  container_port = var.container_port
  alb_ports = var.alb_ports
}
