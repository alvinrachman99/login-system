package main

import (
	"log"
	"login-system/config"
	"login-system/database"
	"login-system/router"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.LoadConfig()

	db := database.InitDB(cfg)

	app := fiber.New()

	router.SetupRoutes(app, db, cfg)

	log.Fatal(app.Listen(":3000"))
}
