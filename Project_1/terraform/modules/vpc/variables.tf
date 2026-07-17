variable "vpc_name" {
  type = string
}

variable "vpc_cidr" {
    description = "This is the VPC CIDR block"
    type = string
}

variable "azs" {
  description = "List of availability zones in the region"
  type        = list(string)
}

variable "private_subnets" {
    description = "List of private subnets in the VPC"
    type = list(string)
    }

variable "public_subnets" {
    description = "List of public subnets in the VPC"
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