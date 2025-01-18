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
	err := r.DB.QueryRow("SELECT id, email, password, firstname, lastname, picture, public_id FROM users WHERE email = $1", email).
		Scan(&user.Id, &user.Email, &user.Password, &user.Firstname, &user.Lastname, &user.Picture, &user.PublicId)
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

func (r *UserRepository) GetAllUser() ([]models.User, error) {
	rows, err := r.DB.Query("SELECT id, email, password, firstname, lastname, picture, public_id FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.Id, &user.Email, &user.Password, &user.Firstname, &user.Lastname, &user.PublicId); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	query := "UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3"
	_, err := r.DB.Exec(query, user.Firstname, user.Lastname, user.Id)
	return err
}

func (r *UserRepository) UpdatePicture(user *models.User) error {
	query := "UPDATE users SET picture = $1 WHERE id = $2"
	_, err := r.DB.Exec(query, user.Picture, user.Id)
	return err
}

func (r *UserRepository) DeleteUser(id int) error {
	query := "DELETE FROM users WHERE id = $1"
	_, err := r.DB.Exec(query, id)
	return err
}
