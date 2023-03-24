package service

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"github.com/google/uuid"
	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := config.GetDB()

	// Validate email format
	if !strings.Contains(input.Email, "@") || !strings.Contains(input.Email, ".") {
		return nil, fmt.Errorf("Invalid email format")
	}

	// Validate phone format
	if len(input.Phone) != 10 || !regexp.MustCompile(`^\d+$`).MatchString(input.Phone) {
		return nil, fmt.Errorf("Invalid phone format")
	}

	// Validate password strength
	if len(input.Password) < 8 || len(input.Password) > 30 {
		return nil, fmt.Errorf("Password must be between 8-30 characters")
	}
	var (
		hasUpper bool
		hasLower bool
		hasNum   bool
		hasSym   bool
	)
	for _, c := range input.Password {
		switch {
		case unicode.IsUpper(c):
			hasUpper = true
		case unicode.IsLower(c):
			hasLower = true
		case unicode.IsNumber(c):
			hasNum = true
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			hasSym = true
		default:
			// do nothing
		}
	}
	if !hasUpper || !hasLower || !hasNum || !hasSym {
		return nil, fmt.Errorf("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
	}

	// Check if email already exists
	var count int64
	if err := db.Model(&model.User{}).Where("email = ?", strings.ToLower(input.Email)).Count(&count).Error; err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, fmt.Errorf("Email already exists")
	}

	input.Password = model.HashPassword(input.Password)

	user := model.User{
		ID:       uuid.New().String(),
		Name:     input.Name,
		Email:    strings.ToLower(input.Email),
		Password: input.Password,
		Phone:    input.Phone,
		Banned:   input.Banned,
		Role:     input.Role,
		Mailing:  input.Mailing,
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetAll(ctx context.Context) ([]*model.User, error) {
	db := config.GetDB()

	var users []*model.User
	if err := db.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("email LIKE ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
