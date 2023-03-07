package model

import "time"

type Cart struct {
	UserID    string   `json:"userID" gorm:"size:191;primaryKey"`
	User      *User    `json:"user"`
	ProductID string   `json:"productID" gorm:"size:191;primaryKey"`
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
	Notes     string   `json:"notes"`
}

type WishlistItem struct {
	Wishlist   *Wishlist `json:"wishlist"`
	WishlistID string    `json:"wishlistID" gorm:"size:191;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Product    *Product  `json:"product"`
	ProductID  string    `json:"productID" gorm:"size:191;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type Wishlist struct {
	ID           string          `json:"ID" gorm:"size:191;primaryKey"`
	Title        string          `json:"title"`
	WishlistType WishlistType    `json:"wishlistType"`
	User         *User           `json:"user"`
	UserID       string          `json:"userID"`
	Items        []*WishlistItem `json:"items"`
}

type WishlistFollowing struct {
	Wishlist   *Wishlist `json:"wishlist"`
	WishlistID string    `json:"wishlistID" gorm:"size:191;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	User       *User     `json:"user"`
	UserID     string    `json:"userID" gorm:"size:191;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type WishlistComment struct {
	ID         string    `json:"id"`
	Date       time.Time `json:"date"`
	Content    string    `json:"content"`
	Wishlist   *Wishlist `json:"wishlist"`
	WishlistID string    `json:"wishlistID"`
	User       *User     `json:"user"`
	UserID     string    `json:"userID"`
}
