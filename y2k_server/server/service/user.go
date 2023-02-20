package service

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := config.GetDB()

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
