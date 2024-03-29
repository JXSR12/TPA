package model

import "golang.org/x/crypto/bcrypt"

type User struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Email         string   `json:"email"`
	Phone         string   `json:"phone"`
	Password      string   `json:"password"`
	Banned        bool     `json:"banned"`
	Role          UserRole `json:"role"`
	Mailing       bool     `json:"mailing"`
	CreditBalance float64  `json:"creditBalance"`
}

func HashPassword(s string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	return string(hashed)
}

func ComparePassword(hashed string, normal string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(normal))
}
