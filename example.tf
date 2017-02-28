provider "aws" {
	region = "us-east-1"
}

resource "aws_instance" "example" {
	ami = "ami-0d729a60"
	instance_type = "t2.micro"
	subnet_id = "subnet-10957a7a"
	tags {
		Name = "vishal-laser-shark"
	}
}
