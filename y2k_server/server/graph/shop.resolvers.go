package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
	"github.com/jxsr12/oldegg/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// CreateShop is the resolver for the createShop field.
func (r *mutationResolver) CreateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop, _ := service.ShopGetByUserID(ctx, userID)

	if shop != nil {
		return nil, &gqlerror.Error{
			Message: "Error, user already has shop",
		}
	}

	shoppw := "DEFAULT_OLDEGG_SPW"
	if input.Password != nil {
		shoppw = *input.Password
	}

	model := &model.Shop{
		ID:          uuid.NewString(),
		Name:        input.Name,
		Address:     input.Address,
		ProfilePic:  input.ProfilePic,
		Description: input.Description,
		Banner:      input.Banner,
		UserID:      userID,
		Password:    shoppw,
	}

	return model, db.Create(model).Error
}

// CreateShopAdmin is the resolver for the createShopAdmin field.
func (r *mutationResolver) CreateShopAdmin(ctx context.Context, input model.NewShop, userID string) (*model.Shop, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	adminID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	admin, _ := service.UserGetByID(ctx, adminID)

	if admin.Role != model.UserRoleAdmin {
		return nil, &gqlerror.Error{
			Message: "Unauthorized to create shop for others",
		}
	}

	shop, _ := service.ShopGetByUserID(ctx, userID)

	if shop != nil {
		return nil, &gqlerror.Error{
			Message: "Error, user already has shop",
		}
	}

	shoppw := "DEFAULT_OLDEGG_SPW"
	if input.Password != nil {
		shoppw = *input.Password
	}

	model := &model.Shop{
		ID:          uuid.NewString(),
		Name:        input.Name,
		Address:     input.Address,
		ProfilePic:  input.ProfilePic,
		Description: input.Description,
		Banner:      input.Banner,
		UserID:      userID,
		Password:    shoppw,
	}

	return model, db.Create(model).Error
}

// UpdateShop is the resolver for the updateShop field.
func (r *mutationResolver) UpdateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop, err := service.ShopGetByUserID(ctx, userID)

	if err != nil || shop == nil {
		return nil, &gqlerror.Error{
			Message: "Error, shop not found",
		}
	}

	if input.Name != "" {
		shop.Name = input.Name
	}

	if input.Address != "" {
		shop.Address = input.Address
	}

	if input.ProfilePic != "" {
		shop.ProfilePic = input.ProfilePic
	}

	if input.Description != "" {
		shop.Description = input.Description
	}

	if input.Banner != "" {
		shop.Banner = input.Banner
	}

	if err := db.Save(&shop).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error, could not update shop",
		}
	}

	return shop, nil
}

// Shop is the resolver for the shop field.
func (r *queryResolver) Shop(ctx context.Context, id *string, keyword *string) (*model.Shop, error) {
	db := config.GetDB()

	var shop model.Shop

	if id != nil {
		if err := db.Where("id = ?", *id).First(&shop).Error; err != nil {
			return nil, &gqlerror.Error{
				Message: "Error, shop not found",
			}
		}
	} else if keyword != nil {
		if err := db.Where("name LIKE ?", "%"+*keyword+"%").First(&shop).Error; err != nil {
			return nil, &gqlerror.Error{
				Message: "Error, shop not found",
			}
		}
	}

	return &shop, nil
}

// Shops is the resolver for the shops field.
func (r *queryResolver) Shops(ctx context.Context) ([]*model.Shop, error) {
	db := config.GetDB()

	var shops []*model.Shop

	err := db.
		Table("shops").
		Select("shops.*, COALESCE(SUM(product_details.quantity), 0) AS total_items_sold").
		Joins("LEFT JOIN products ON shops.id = products.shop_id").
		Joins("LEFT JOIN transaction_details AS product_details ON products.id = product_details.product_id").
		Group("shops.id").
		Order("total_items_sold DESC").
		Find(&shops).Error
	if err != nil {
		return nil, err
	}

	return shops, nil
}

// UserShop is the resolver for the userShop field.
func (r *queryResolver) UserShop(ctx context.Context) (*model.Shop, error) {
	panic(fmt.Errorf("not implemented: UserShop - userShop"))
}

// ShopReviews is the resolver for the shopReviews field.
func (r *queryResolver) ShopReviews(ctx context.Context, id string) ([]*model.Review, error) {
	db := config.GetDB()

	// Get all products that belong to the shop with the given ID
	var products []model.Product
	if err := db.Where("shop_id = ?", id).Find(&products).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error getting products for shop",
		}
	}

	// Extract the product IDs
	productIDs := []string{}
	for _, product := range products {
		productIDs = append(productIDs, product.ID)
	}

	// Get all reviews that match the extracted product IDs
	var reviews []*model.Review
	if err := db.Where("product_id IN (?)", productIDs).Find(&reviews).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error getting reviews for shop",
		}
	}

	return reviews, nil
}

// AverageRating is the resolver for the averageRating field.
func (r *queryResolver) AverageRating(ctx context.Context, id *string) (float64, error) {
	db := config.GetDB()

	var averageRating float64
	if err := db.Raw("SELECT AVG(rating) FROM reviews WHERE product_id IN (SELECT id FROM products WHERE shop_id = ?)", id).Scan(&averageRating).Error; err != nil {
		return 0, err
	}
	return averageRating, nil
}

// ItemsSold is the resolver for the itemsSold field.
func (r *queryResolver) ItemsSold(ctx context.Context, id *string) (int, error) {
	db := config.GetDB()

	var itemsSold int
	if err := db.Raw("SELECT SUM(quantity) FROM transaction_details WHERE product_id IN (SELECT id FROM products WHERE shop_id = ?)", id).Scan(&itemsSold).Error; err != nil {
		return 0, err
	}
	return itemsSold, nil
}

// User is the resolver for the user field.
func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	db := config.GetDB()

	var user model.User

	if err := db.Where("id = ?", obj.UserID).First(&user).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error, user not found",
		}
	}

	return &user, nil
}

// Products is the resolver for the products field.
func (r *shopResolver) Products(ctx context.Context, obj *model.Shop, keyword *string, topSold *bool) ([]*model.Product, error) {
	db := config.GetDB()

	// Create a query builder for the "products" table
	query := db.Model(&model.Product{})

	// Filter by shop ID
	query = query.Where("shop_id = ? AND valid_to IS NULL", obj.ID)

	// Apply keyword filter if provided
	if keyword != nil {
		// Search for products with name or description that contains the keyword
		keywordStr := fmt.Sprintf("%%%s%%", *keyword)
		query = query.Where("name LIKE ? OR description LIKE ?", keywordStr, keywordStr)
	}

	// Sort by sales count if topSold flag is true
	if topSold != nil && *topSold {
		query = query.Order("sales_count DESC")
	}

	// Execute the query and retrieve the results
	var products []*model.Product
	if err := query.Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

// TransactionValue is the resolver for the transactionValue field.
func (r *shopResolver) TransactionValue(ctx context.Context, obj *model.Shop) (float64, error) {
	db := config.GetDB()

	var transactionValue float64

	// Query the database to retrieve all the transaction details that belong to products of the shop
	query := db.Table("transaction_details").
		Joins("JOIN products ON transaction_details.product_id = products.id").
		Where("products.shop_id = ?", obj.ID).
		Select("transaction_details.quantity, products.price")
	rows, err := query.Rows()
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	// Iterate through each row returned by the query and calculate the transaction value
	for rows.Next() {
		var quantity int
		var price float64
		if err := rows.Scan(&quantity, &price); err != nil {
			return 0, err
		}
		transactionValue += float64(quantity) * price
	}
	if err := rows.Err(); err != nil {
		return 0, err
	}

	return transactionValue, nil
}

// Shop returns ShopResolver implementation.
func (r *Resolver) Shop() ShopResolver { return &shopResolver{r} }

type shopResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *shopResolver) Password(ctx context.Context, obj *model.Shop) (string, error) {
	panic(fmt.Errorf("not implemented: Password - password"))
}
