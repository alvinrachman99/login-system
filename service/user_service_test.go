package service

import (
	"log"
	"login-system/config"
	"login-system/database"
	"login-system/models"
	"login-system/repository"
	"testing"

	"github.com/stretchr/testify/require"
)

var userService *UserService

func init() {
	cfg := config.LoadConfig()
	db := database.InitDB(cfg)
	repo := repository.NewUserRepository(db)

	userService = NewUserService(repo)
}

func TestGetAllUser(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		users, err := userService.GetAllUser()
		require.Nil(t, err)

		log.Println(users)
	})
}

func TestUpdateUser(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		id := 5

		user := &models.User{
			Password:  "tespassword",
			Firstname: "alv",
			Lastname:  "rach",
			Id:        id,
		}

		err := userService.UpdateUser(user)
		require.Nil(t, err)
	})
}

func TestDeleteUser(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		id := 3
		err := userService.DeleteUser(id)
		require.Nil(t, err)
	})
}
