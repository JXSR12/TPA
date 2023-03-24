package model

import "time"

type SupportChat struct {
	ID         string    `json:"id"`
	CreatedAt  time.Time `json:"createdAt"`
	Customer   *User     `json:"customer"`
	CustomerID string    `json:"customerID" gorm:"size:191"`
	IsResolved bool      `json:"isResolved"`
	TopicTags  string    `json:"topicTags"`
}

type SupportMessage struct {
	ID             string    `json:"id"`
	IsStaffMessage bool      `json:"isStaffMessage"`
	CreatedAt      time.Time `json:"createdAt"`
	Chat           *UserChat `json:"chat"`
	ChatID         string    `json:"chatID" gorm:"size:191"`
	Text           string    `json:"text"`
	FileURL        string    `json:"fileURL"`
	ImageURL       string    `json:"imageURL"`
}

type UserChat struct {
	ID         string    `json:"id"`
	CreatedAt  time.Time `json:"createdAt"`
	Seller     *Shop     `json:"seller"`
	SellerID   string    `json:"sellerID" gorm:"size:191"`
	Customer   *User     `json:"customer"`
	CustomerID string    `json:"customerID" gorm:"size:191"`
}

type UserMessage struct {
	ID              string    `json:"id"`
	IsSellerMessage bool      `json:"isSellerMessage"`
	CreatedAt       time.Time `json:"createdAt"`
	Chat            *UserChat `json:"chat"`
	ChatID          string    `json:"chatID" gorm:"size:191"`
	Text            string    `json:"text"`
	FileURL         string    `json:"fileURL"`
	ImageURL        string    `json:"imageURL"`
}

type Notification struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	FromName  string    `json:"fromName"`
	User      *User     `json:"user"`
	UserID    string    `json:"userID" gorm:"size:191"`
	Text      string    `json:"text"`
	IsRead    bool      `json:"isRead"`
}
