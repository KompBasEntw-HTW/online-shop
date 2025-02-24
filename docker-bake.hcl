group "default"{
  targets = ["online-shop"]
}

target "online-shop" {
  dockerfile= "Dockerfile"
  target= "prod"
  tags = ["localhost:7000/online-shop"]
}
