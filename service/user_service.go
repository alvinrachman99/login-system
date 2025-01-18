package service

import (
	"errors"
	"fmt"
	"login-system/models"
	"login-system/repository"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
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

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	user, err := s.UserRepo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("invalid email")
	}

	if user.Picture != "" {
		ext := strings.Split(user.Picture, ".")[1]
		// Cek apakah file gambar ada
		filePath := filepath.Join("uploads", fmt.Sprintf("image_%d.%s", user.Id, ext))
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			return nil, errors.New("image not found")
		}
		user.Picture = fmt.Sprintf("image_%d.%s", user.Id, ext)
	}

	return user, nil
}

func (s *UserService) UpdateUser(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	return s.UserRepo.UpdateUser(user)
}

func (s *UserService) UpdatePicture(user *models.User, fh *multipart.FileHeader) (path string, err error) {
	// Validasi tipe file
	if fh.Header.Get("Content-Type") != "image/jpeg" && fh.Header.Get("Content-Type") != "image/png" {
		return "", errors.New("only JPEG and PNG images are allowed")
	}

	// Validasi ukuran file
	if fh.Size > 5*1024*1024 { // 5 MB
		return "", errors.New("file size exceeds 5MB limit")
	}

	// Buat folder uploads jika belum ada
	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		os.Mkdir("./uploads", os.ModePerm)
	}

	// Tentukan lokasi penyimpanan file
	path = filepath.Join("uploads", fmt.Sprintf("image_%d%s", user.Id, filepath.Ext(fh.Filename)))

	// Hapus file lama
	oldFilePath := filepath.Join("uploads", fmt.Sprintf("image_%d", user.Id))
	if err := os.RemoveAll(oldFilePath); err != nil {
		fmt.Println("No old file found to remove")
	}

	user.Picture = uuid.NewString() + filepath.Ext(fh.Filename)

	return path, s.UserRepo.UpdatePicture(user)
}

func (s *UserService) DeleteUser(id int) error {
	return s.UserRepo.DeleteUser(id)
}
