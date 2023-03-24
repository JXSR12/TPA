package model

import "time"

type Review struct {
	ID                  string    `json:"id"`
	User                *User     `json:"user"`
	UserID              string    `json:"userID" gorm:"size:191"`
	Product             *Product  `json:"product"`
	ProductID           string    `json:"productID" gorm:"size:191"`
	CreatedAt           time.Time `json:"createdAt"`
	Rating              int       `json:"rating"`
	OnTimeDelivery      bool      `json:"onTimeDelivery"`
	ProductAccuracy     bool      `json:"productAccuracy"`
	ServiceSatisfaction bool      `json:"serviceSatisfaction"`
	Description         string    `json:"description"`
	IsAnonymous         bool      `json:"isAnonymous"`
}

type SupportChatReview struct {
	ID          string    `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	Rating      int       `json:"rating"`
	Description string    `json:"description"`
	User        *User     `json:"user"`
	UserID      string    `json:"userID" gorm:"size:191"`
}
