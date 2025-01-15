package repository

import (
	"database/sql"
	"login-system/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow("SELECT id, email, password, created_at, updated_at, public_id FROM users WHERE email = $1", email).
		Scan(&user.Id, &user.Email, &user.Password, &user.Firstname, &user.Lastname, &user.PublicId)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := "INSERT INTO users (email, password, firstname, lastname, public_id) VALUES ($1, $2, $3, $4, $5)"
	_, err := r.DB.Exec(query, user.Email, user.Password, user.Firstname, user.Lastname, uuid.New())
	return err
}
