
variable "source_ami" {
  type = string
  default = "ami-0f1a5f5ada0e7da53"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "profile" {
  type    = string
  default = "dev"
}

variable "aws_region" {
    default = "us-west-2"
}

source "amazon-ebs" "my-ami" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "ami for csye6225 us-west-2"
  instance_type   = "t2.micro"
  region          = "${var.aws_region}"
  ami_users       = ["931880155240"]
  ami_regions = [
    "us-west-2",
  ]
  source_ami   = "${var.source_ami}"
  ssh_username = "${var.ssh_username}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  launch_block_device_mappings {
    device_name           = "/dev/sdf"
    volume_size           = 50
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

build {
  sources = ["sources.amazon-ebs.my-ami"]
  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }
  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }
  provisioner "shell" {
    scripts = [
      "dependencies.sh"
    ]
  }

  

}
