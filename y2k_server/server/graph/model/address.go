package model

type Address struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Content string `json:"content"`
	User    *User  `json:"user"`
	UserID  string `json:"userID" gorm:"size:191"`
	Primary bool   `json:"primary"`
}
