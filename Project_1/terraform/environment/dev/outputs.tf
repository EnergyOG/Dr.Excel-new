output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "internet_gateway_id" {
  value = module.vpc.internet_gateway_id
}

output "nat_gateway_ids" {
  value = module.vpc.nat_gateway_ids
}

output "alb_security_group_id" {
  value = module.security_group.alb_security_group_id
}

output "ecs_security_group_id" {
  value = module.security_group.ecs_security_group_id
}