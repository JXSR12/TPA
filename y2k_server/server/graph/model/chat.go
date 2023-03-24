package model

import (
	"github.com/jxsr12/oldegg/config"
)

type Chat struct {
	ID       string     `json:"ID"`
	Users    []*User    `json:"users" gorm:"many2many:user_chats;"`
	Messages []*Message `json:"messages"`
}

type Message struct {
	ID      string `json:"ID"`
	Content string `json:"Content"`
	User    *User  `json:"User"`
	UserID  string `json:"-"`
	Chat    *Chat  `json:"Chat"`
	ChatID  string `json:"chatID"`
	FileURL string `json:"FileURL"`
}

func GetRooms(id string) []Chat {
	db := config.GetDB()

	var chats []Chat
	user, _ := GetUserByIDNoCtx(id)

	db.Preload("Users").Model(&user).Order("chats.created_at desc").Association("Chats").Find(&chats)

	return chats
}

func CreateRoom(users []User) (Chat, error) {
	db := config.GetDB()

	var chat Chat

	err := db.Create(&chat).Error
	err = db.Model(&chat).Association("Users").Append(users)

	return chat, err
}

func GetRoomById(id uint) *Chat {
	db := config.GetDB()

	var chat Chat
	db.Find(&chat, "id = ?", id)
	return &chat
}

func CreateMessage(chat_id uint, user_id string, message *Message) Message {
	db := config.GetDB()

	user, _ := GetUserByIDNoCtx(user_id)
	chat := GetRoomById(chat_id)

	message.User = user
	message.UserID = user.ID
	message.Chat = chat
	db.Model(&chat).Association("Messages").Append(message)
	return *message
}

func GetMessage(chat *Chat) []Message {
	db := config.GetDB()

	var messages []Message
	db.Preload("User").Preload("Post").Model(chat).Association("Messages").Find(&messages)
	return messages
}

func GetUserByIDNoCtx(id string) (*User, error) {
	db := config.GetDB()

	var user User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
