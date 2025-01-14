package main

import (
	"log"
	"login-system/config"
	"login-system/database"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.LoadConfig()

	database.InitDB(cfg)

	app := fiber.New()

	log.Fatal(app.Listen(":3000"))
}
