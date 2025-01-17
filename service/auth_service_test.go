package service

import (
	"log"
	"login-system/config"
	"login-system/database"
	"login-system/models"
	"login-system/repository"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

var authService *AuthService

func init() {
	cfg := config.LoadConfig()
	db := database.InitDB(cfg)
	repo := repository.NewUserRepository(db)

	authService = NewAuthService(repo)
}

func TestRegister(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		user := &models.User{
			Email:     "admin@gmail.com",
			Password:  "mypassword",
			Firstname: uuid.NewString(),
			Lastname:  uuid.NewString(),
		}

		err := authService.Register(user)
		require.Nil(t, err)
	})
}

func TestLogin(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		email := "tes@gmail.com"
		password := "mypassword"

		user := &models.User{
			Email:     email,
			Password:  password,
			Firstname: uuid.NewString(),
			Lastname:  uuid.NewString(),
		}

		err := authService.Register(user)
		require.Nil(t, err)

		token, err := authService.Login(email, password, os.Getenv("JWT_SECRET"))
		require.Nil(t, err)

		log.Printf("token: %v", token)
	})
}
