package model

import "time"

type Category struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Products []*Product `json:"products"`
}

type Product struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Images      []*ProductImage `json:"images"`
	Description string          `json:"description"`
	Price       float64         `json:"price"`
	Discount    float64         `json:"discount"`
	Stock       int             `json:"stock"`
	Metadata    string          `json:"metadata"`
	CreatedAt   time.Time       `json:"createdAt"`
	ValidTo     *time.Time      `json:"validTo"`
	Category    *Category       `json:"category"`
	CategoryID  string          `json:"categoryID" gorm:"size:191"`
	Shop        *Shop           `json:"shop"`
	ShopID      string          `json:"shopID" gorm:"size:191"`
	Group       *ProductGroup   `json:"group"`
	GroupID     string          `json:"groupID" gorm:"size:191"`
	Brand       *ProductBrand   `json:"brand"`
	BrandID     string          `json:"brandID" gorm:"size:191"`
	Reviews     []*Review       `json:"reviews"`
}

type ProductImage struct {
	ID        string   `json:"id"`
	Image     string   `json:"image"`
	Product   *Product `json:"product"`
	ProductID string   `json:"productID" gorm:"size:191"`
}
