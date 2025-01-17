package service

import (
	"login-system/models"
	"login-system/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	UserRepo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{UserRepo: repo}
}

func (s *UserService) GetAllUser() ([]models.User, error) {
	return s.UserRepo.GetAllUser()
}

func (s *UserService) UpdateUser(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	return s.UserRepo.UpdateUser(user)
}

func (s *UserService) DeleteUser(id int) error {
	return s.UserRepo.DeleteUser(id)
}
