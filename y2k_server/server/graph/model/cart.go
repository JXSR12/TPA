package model

type Cart struct {
	UserID    string   `json:"userID" gorm:"size:191;primaryKey"`
	User      *User    `json:"user"`
	ProductID string   `json:"productID" gorm:"size:191;primaryKey"`
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
	Notes     string   `json:"notes"`
}

type Wishlist struct {
	ID           string       `json:"ID"`
	Title        string       `json:"title"`
	WishlistType WishlistType `json:"wishlistType"`
	UserID       string       `json:"userID" gorm:"size:191;primaryKey"`
	User         *User        `json:"user"`
}

type WishlistItem struct {
	Wishlist   Wishlist `json:"wishlist"`
	WishlistID string   `json:"wishlistID"`
	ProductID  string   `json:"productID" gorm:"size:191;primaryKey"`
	Product    *Product `json:"product"`
}
