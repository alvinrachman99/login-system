package handler

import (
	"database/sql"
	"login-system/config"
	"login-system/models"
	"login-system/repository"
	"login-system/service"
	"os"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	AuthService *service.AuthService
}

func NewAuthHandler(db *sql.DB, cfg config.Config) *AuthHandler {
	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	return &AuthHandler{AuthService: authService}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if err := h.AuthService.Register(&user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User registered successfully"})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	token, err := h.AuthService.Login(req.Email, req.Password, os.Getenv("JWT_SECRET"))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Login successful", "status": fiber.StatusOK, "token": token})
}
