package service

import (
	"context"

	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
)

func ShopGetByUserID(ctx context.Context, userID string) (*model.Shop, error) {
	db := config.GetDB()

	var shop model.Shop
	if err := db.Model(shop).Where("user_id = ?", userID).Take(&shop).Error; err != nil {
		return nil, err
	}

	return &shop, nil
}

func GetStringOrDefault(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
