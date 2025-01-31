package router

import (
	"database/sql"
	"login-system/config"
	"login-system/handler"
	"login-system/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB, cfg config.Config) {
	authHandler := handler.NewAuthHandler(db, cfg)
	userHandler := handler.NewUserHandler(db, cfg)

	auth := app.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	user := app.Group("/user", middleware.JWTMiddleware())
	user.Get("/alluser", userHandler.GetAllUser)
	user.Post("/user", userHandler.GetUserByEmail)
	user.Put("/update/:id", userHandler.UpdateUser)
	user.Patch("/update-image/:id", userHandler.UpdatePicture)
	user.Delete("/delete/:id", userHandler.DeleteUser)

	app.Static("images/", "./uploads")
}
