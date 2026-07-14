module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_dns_support   = true
  enable_dns_hostnames = true

  enable_nat_gateway     = true
  one_nat_gateway_per_az = true

  tags = {
    Environment = "dev"
    Terraform   = "true"
    Project     = "dr-excel"
  }
}