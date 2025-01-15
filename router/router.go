package router

import (
	"database/sql"
	"login-system/config"
	"login-system/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB, cfg config.Config) {
	authHandler := handler.NewAuthHandler(db, cfg)

	route := app.Group("/auth")
	route.Post("/register", authHandler.Register)
	route.Post("/login", authHandler.Login)
}
