package service

import (
	"errors"
	"login-system/models"
	"login-system/repository"
	"login-system/utility"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserRepo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{UserRepo: repo}
}

func (s *AuthService) Register(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	return s.UserRepo.CreateUser(user)
}

func (s *AuthService) Login(email, password string, secret string) (string, error) {
	user, err := s.UserRepo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	tokenString, err := utility.GenerateToken(user.PublicId.String(), secret)
	if err != nil {
		return "", errors.New("failed generate token")
	}

	return tokenString, nil
}
