terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider (Make sure your AWS CLI is configured locally)
provider "aws" {
  region = "us-west-2"
}

# Security Group to allow web traffic and SSH
resource "aws_security_group" "brevity_sg" {
  name        = "brevity-web-sg"
  description = "Allow HTTP, API, and SSH traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Frontend Nginx
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Go Backend API
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH access
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# The actual server
resource "aws_instance" "brevity_server" {
  ami           = "ami-0735c191cf914754d" # Ubuntu 22.04 LTS (us-west-2)
  instance_type = "t3.micro" # Free-tier eligible

  vpc_security_group_ids = [aws_security_group.brevity_sg.id]

  # Automatically install Docker when the server boots up
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io docker-compose
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "Brevity-Sharing-Production"
  }
}

# Print the public IP of the server when finished
output "server_public_ip" {
  value = aws_instance.brevity_server.public_ip
}
