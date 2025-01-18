package models

import "github.com/google/uuid"

type User struct {
	Id        int       `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Firstname string    `json:"firstname"`
	Lastname  string    `json:"lastname"`
	Picture   string    `json:"picture"`
	PublicId  uuid.UUID `json:"public_id"`
}
