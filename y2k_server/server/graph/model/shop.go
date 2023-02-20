package model

type Shop struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Address     string     `json:"address"`
	Description string     `json:"description"`
	ProfilePic  string     `json:"profilePic"`
	User        *User      `json:"user"`
	UserID      string     `json:"userID" gorm:"size:191"`
	Products    []*Product `json:"products"`
}