package model

import "time"

type TransactionDetail struct {
	TransactionHeader   *TransactionHeader `json:"transactionHeader"`
	TransactionHeaderID string             `json:"transactionHeaderID" gorm:"size:191"`
	Product             *Product           `json:"product"`
	ProductID           string             `json:"productID" gorm:"size:191"`
	Quantity            int                `json:"quantity"`
	Notes               string             `json:"notes"`
}

type TransactionHeader struct {
	ID                 string               `json:"id"`
	Date               time.Time            `json:"date"`
	User               *User                `json:"user"`
	UserID             string               `json:"userID" gorm:"size:191"`
	Shipment           *Shipment            `json:"shipment"`
	ShipmentID         string               `json:"shipmentID" gorm:"size:191"`
	PaymentMethod      *PaymentMethod       `json:"paymentMethod"`
	PaymentMethodID    string               `json:"paymentMethodID" gorm:"size:191"`
	Status             string               `json:"status"`
	Address            *Address             `json:"address"`
	AddressID          string               `json:"addressID" gorm:"size:191"`
	TransactionDetails []*TransactionDetail `json:"transactionDetails"`
}

type PaymentMethod struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Shipment struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	Fee  float64 `json:"fee"`
}

type ReviewCredit struct {
	Product   *Product `json:"product"`
	ProductID string   `json:"productID" gorm:"size:191"`
	User      *User    `json:"user"`
	UserID    string   `json:"userID" gorm:"size:191"`
}
