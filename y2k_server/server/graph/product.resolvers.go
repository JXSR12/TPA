package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
	"github.com/jxsr12/oldegg/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

// Products is the resolver for the products field.
func (r *categoryResolver) Products(ctx context.Context, obj *model.Category) ([]*model.Product, error) {
	db := config.GetDB()

	var models []*model.Product

	return models, db.Where("category_id = ?", obj.ID).Find(&models).Error
}

// CreateProduct is the resolver for the createProduct field.
func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct, shopID string) (*model.Product, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	db := config.GetDB()
	id := uuid.NewString()
	groupId := uuid.NewString()

	group := &model.ProductGroup{
		ID: groupId,
	}
	db.Create(group)

	model := &model.Product{
		ID:          id,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Discount:    input.Discount,
		Metadata:    input.Metadata,
		CategoryID:  input.CategoryID,
		ShopID:      shopID,
		BrandID:     input.BrandID,
		GroupID:     groupId,
		Stock:       input.Stock,
		CreatedAt:   time.Now(),
	}

	return model, db.Create(model).Error
}

// CreateProductVariant is the resolver for the createProductVariant field.
func (r *mutationResolver) CreateProductVariant(ctx context.Context, input model.NewProduct, groupID string) (*model.Product, error) {
	panic(fmt.Errorf("not implemented: CreateProductVariant - createProductVariant"))
}

// CreateProductImage is the resolver for the createProductImage field.
func (r *mutationResolver) CreateProductImage(ctx context.Context, image string, productID string) (*model.ProductImage, error) {
	db := config.GetDB()
	model := &model.ProductImage{
		ID:        uuid.NewString(),
		Image:     image,
		ProductID: productID,
	}

	return model, db.Create(model).Error
}

// DeleteProductImage is the resolver for the deleteProductImage field.
func (r *mutationResolver) DeleteProductImage(ctx context.Context, image string, productID string) (bool, error) {
	db := config.GetDB()

	// Build the delete query using placeholders to avoid SQL injection.
	query := "DELETE FROM product_images WHERE image = ? AND product_id = ?"
	args := []interface{}{image, productID}

	// Execute the delete query.
	result := db.Exec(query, args...)
	if result.Error != nil {
		return false, result.Error
	}

	// Check the number of rows affected by the delete operation.
	if result.RowsAffected == 0 {
		return false, fmt.Errorf("image not found")
	}

	return true, nil
}

// CreateProductImages is the resolver for the createProductImages field.
func (r *mutationResolver) CreateProductImages(ctx context.Context, images []string, productID string) (bool, error) {
	db := config.GetDB()
	for _, img := range images {
		model := &model.ProductImage{
			ID:        uuid.NewString(),
			Image:     img,
			ProductID: productID,
		}
		err := db.Create(model).Error

		if err != nil {
			return false, err
		}
	}
	return true, nil
}

// CreateBrand is the resolver for the createBrand field.
func (r *mutationResolver) CreateBrand(ctx context.Context, name string, logo string) (*model.ProductBrand, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	id := uuid.NewString()
	model := &model.ProductBrand{
		ID:   id,
		Name: name,
		Logo: logo,
	}

	return model, db.Create(model).Error
}

// CreateCategory is the resolver for the createCategory field.
func (r *mutationResolver) CreateCategory(ctx context.Context, name string) (*model.Category, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	id := uuid.NewString()
	model := &model.Category{
		ID:   id,
		Name: name,
	}

	return model, db.Create(model).Error
}

// CreateSearchQuery is the resolver for the createSearchQuery field.
func (r *mutationResolver) CreateSearchQuery(ctx context.Context, query *string) (*model.SearchQuery, error) {
	db := config.GetDB()

	// Check if there is an existing SearchQuery with the same query string.
	existingSearchQuery := &model.SearchQuery{}
	err := db.Where("query = ?", *query).First(existingSearchQuery).Error
	if err == nil {
		// If there is an existing search query, increment its count and return it.
		existingSearchQuery.Count++
		if err := db.Save(existingSearchQuery).Error; err != nil {
			return nil, err
		}
		return existingSearchQuery, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// If there was an error other than "record not found", return it.
		return nil, err
	}

	// If there is no existing SearchQuery with the same query string, create a new one.
	newSearchQuery := &model.SearchQuery{
		ID:    uuid.NewString(),
		Query: *query,
		Count: 1,
	}
	if err := db.Create(newSearchQuery).Error; err != nil {
		return nil, err
	}
	return newSearchQuery, nil
}

// SaveUserSearch is the resolver for the saveUserSearch field.
func (r *mutationResolver) SaveUserSearch(ctx context.Context, query *string) (*model.UserSearch, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	db := config.GetDB()

	// Check if the user already has 10 saved searches
	var count int64
	if err := db.Model(&model.UserSearch{}).Where("user_id = ?", userID).Count(&count).Error; err != nil {
		return nil, err
	}
	if count >= 10 {
		// Delete the oldest UserSearch entity
		if err := db.Exec("DELETE FROM user_searches WHERE user_id = ? AND created_at IN (SELECT created_at FROM user_searches WHERE user_id = ? ORDER BY created_at ASC LIMIT 1)", userID, userID).Error; err != nil {
			return nil, err
		}
	}

	// Check if there's already a search query with the same query string
	var searchQuery model.SearchQuery
	if err := db.Where("query = ?", *query).First(&searchQuery).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}

		// Create a new search query if it doesn't exist
		searchQuery = model.SearchQuery{
			ID:    uuid.NewString(),
			Query: *query,
			Count: 1,
		}
		if err := db.Create(&searchQuery).Error; err != nil {
			return nil, err
		}
	} else {
		// Increment the count of the existing search query
		searchQuery.Count++
		if err := db.Save(&searchQuery).Error; err != nil {
			return nil, err
		}
	}

	// Create a new UserSearch entity
	userSearch := &model.UserSearch{
		UserID:    userID,
		SearchID:  searchQuery.ID,
		CreatedAt: time.Now(),
	}

	if err := db.Create(userSearch).Error; err != nil {
		return nil, err
	}

	return userSearch, nil
}

// DeleteUserSearch is the resolver for the deleteUserSearch field.
func (r *mutationResolver) DeleteUserSearch(ctx context.Context, query *string) (*model.UserSearch, error) {
	panic(fmt.Errorf("not implemented: DeleteUserSearch - deleteUserSearch"))
}

// CreatePromotionBanner is the resolver for the createPromotionBanner field.
func (r *mutationResolver) CreatePromotionBanner(ctx context.Context, title string, link string, image string) (*model.PromotionBanner, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID
	user, _ := service.UserGetByID(ctx, userID)

	if user.Role != model.UserRoleAdmin {
		return nil, &gqlerror.Error{
			Message: "Unauthorized to create promotions",
		}
	}

	banner := &model.PromotionBanner{
		ID:    uuid.NewString(),
		Title: title,
		Link:  link,
		Image: image,
	}

	err := db.Create(banner).Error
	if err != nil {
		return nil, err
	}

	return banner, nil
}

// DeletePromotionBanner is the resolver for the deletePromotionBanner field.
func (r *mutationResolver) DeletePromotionBanner(ctx context.Context, id string) (bool, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID
	user, _ := service.UserGetByID(ctx, userID)

	if user.Role != model.UserRoleAdmin {
		return false, &gqlerror.Error{
			Message: "Unauthorized to delete promotions",
		}
	}

	if err := db.Delete(&model.PromotionBanner{}, "id = ?", id).Error; err != nil {
		return false, err
	}

	return true, nil
}

// CreateProductAuto is the resolver for the createProductAuto field.
func (r *mutationResolver) CreateProductAuto(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "No auth token",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop, err := service.ShopGetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	db := config.GetDB()
	id := uuid.NewString()
	groupId := uuid.NewString()

	group := &model.ProductGroup{
		ID: groupId,
	}
	db.Create(group)

	model := &model.Product{
		ID:          id,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Discount:    input.Discount,
		Metadata:    input.Metadata,
		CategoryID:  input.CategoryID,
		ShopID:      shop.ID,
		BrandID:     input.BrandID,
		GroupID:     groupId,
		Stock:       input.Stock,
		CreatedAt:   time.Now(),
	}

	return model, db.Create(model).Error
}

// UpdateProduct is the resolver for the updateProduct field.
func (r *mutationResolver) UpdateProduct(ctx context.Context, productID string, input model.NewProduct) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)
	err := db.First(product, "id = ?", *&productID).Error
	if err != nil {
		return nil, err
	}

	product.Name = input.Name
	product.Description = input.Description
	product.Price = input.Price
	product.Discount = input.Discount
	product.Metadata = input.Metadata
	product.Stock = input.Stock

	return product, db.Save(product).Error
}

// DeleteProduct is the resolver for the deleteProduct field.
func (r *mutationResolver) DeleteProduct(ctx context.Context, productID string) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)
	err := db.First(product, "id = ?", *&productID).Error
	if err != nil {
		return nil, err
	}

	now := time.Now()

	product.ValidTo = &now
	err = db.Save(product).Error
	if err != nil {
		return nil, err
	}

	return product, nil
}

// Images is the resolver for the images field.
func (r *productResolver) Images(ctx context.Context, obj *model.Product) ([]*model.ProductImage, error) {
	db := config.GetDB()

	var images []*model.ProductImage

	return images, db.Where("product_id = ?", obj.ID).Find(&images).Error
}

// Shop is the resolver for the shop field.
func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	db := config.GetDB()

	model := new(model.Shop)

	return model, db.Where("id = ?", obj.ShopID).First(model).Error
}

// Group is the resolver for the group field.
func (r *productResolver) Group(ctx context.Context, obj *model.Product) (*model.ProductGroup, error) {
	db := config.GetDB()

	model := new(model.ProductGroup)

	return model, db.Where("id = ?", obj.GroupID).First(model).Error
}

// Brand is the resolver for the brand field.
func (r *productResolver) Brand(ctx context.Context, obj *model.Product) (*model.ProductBrand, error) {
	db := config.GetDB()

	brand := new(model.ProductBrand)

	return brand, db.First(brand, "id = ?", obj.BrandID).Error
}

// Category is the resolver for the category field.
func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	db := config.GetDB()

	cat := new(model.Category)

	return cat, db.First(cat, "id = ?", obj.CategoryID).Error
}

// Reviews is the resolver for the reviews field.
func (r *productResolver) Reviews(ctx context.Context, obj *model.Product) ([]*model.Review, error) {
	db := config.GetDB()

	var reviews []*model.Review
	if err := db.Where("product_id = ?", obj.ID).Find(&reviews).Error; err != nil {
		return nil, err
	}

	return reviews, nil
}

// Product is the resolver for the product field.
func (r *productImageResolver) Product(ctx context.Context, obj *model.ProductImage) (*model.Product, error) {
	panic(fmt.Errorf("not implemented: Product - product"))
}

// Category is the resolver for the category field.
func (r *queryResolver) Category(ctx context.Context, id string) (*model.Category, error) {
	panic(fmt.Errorf("not implemented: Category - category"))
}

// Categories is the resolver for the categories field.
func (r *queryResolver) Categories(ctx context.Context, limit *int) ([]*model.Category, error) {
	db := config.GetDB()

	var categories []*model.Category
	if err := db.Find(&categories).Error; err != nil {
		return nil, err
	}

	return categories, nil
}

// Product is the resolver for the product field.
func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", id).Limit(1).Find(&product).Error
}

// Products is the resolver for the products field.
func (r *queryResolver) Products(ctx context.Context, shopID *string, limit *int, offset *int, input *model.SearchProduct, topSold *bool) ([]*model.Product, error) {
	db := config.GetDB()

	var models []*model.Product

	if shopID != nil && limit != nil && offset != nil {
		if topSold != nil && *topSold {
			return models, db.Raw("SELECT p.id, name, description, price, discount, metadata, brand_id, category_id, shop_id, created_at, stock, valid_to FROM products p LEFT JOIN transaction_details td ON p.id = td.product_id WHERE shop_id = ? AND valid_to IS NULL GROUP BY product_id, p.id ORDER BY SUM(quantity) IS NULL, SUM(quantity) DESC LIMIT ? OFFSET ?", shopID, *limit, *offset).Scan(&models).Error
		} else {
			return models, db.Raw("SELECT p.id, name, p.description, price, discount, metadata, brand_id, category_id, shop_id, p.created_at, stock, valid_to FROM reviews pr RIGHT JOIN products p ON p.id = pr.product_id WHERE shop_id = ? AND valid_to IS NULL GROUP BY product_id, p.id ORDER BY AVG(pr.rating) IS NULL, AVG(pr.rating) DESC LIMIT ? OFFSET ?", shopID, *limit, *offset).Scan(&models).Error
		}
	}

	if topSold != nil && *topSold {
		return models, db.Raw("SELECT p.id, name, description, price, discount, metadata, brand_id, category_id, shop_id, created_at, stock, valid_to FROM transaction_details td JOIN products p ON p.id = td.product_id WHERE valid_to IS NULL GROUP BY product_id, p.id ORDER BY SUM(quantity) IS NULL, SUM(quantity) DESC").Scan(&models).Error
	}

	temp := db

	if input != nil {
		if input.IsDiscount != nil && *input.IsDiscount {
			temp = temp.Where("valid_to IS NULL").Order("discount DESC").Limit(15)
		} else {
			if input.HighRating != nil && *input.HighRating {
				temp = temp.Select("products.id, name, products.description, price, discount, metadata, category_id, shop_id, products.created_at, stock, valid_to").
					Joins("JOIN reviews ON products.id = reviews.product_id").
					Where("valid_to IS NULL").
					Group("products.id").
					Having("AVG(reviews.rating) >= 4")
			}
			if input.MinPrice != nil {
				temp = temp.Where("valid_to IS NULL").Where("price >= ?", *input.MinPrice)
			}
			if input.MaxPrice != nil {
				temp = temp.Where("valid_to IS NULL").Where("price <= ?", *input.MaxPrice)
			}
			if input.Keyword != nil {
				temp = temp.Where("valid_to IS NULL").
					Where("(name LIKE ? OR products.description LIKE ?)", "%"+*input.Keyword+"%", "%"+*input.Keyword+"%")
			}
			if input.CategoryID != nil {
				temp = temp.Where("valid_to IS NULL").Where("category_id = ?", *input.CategoryID)
			}
			if input.BrandID != nil {
				temp = temp.Where("valid_to IS NULL").Where("brand_id = ?", *input.BrandID)
			}
			if input.ExceptID != nil {
				temp = temp.Where("valid_to IS NULL").Where("id != ?", *input.ExceptID)
			}
			if input.OrderBy != nil {
				if *input.OrderBy == "newest" {
					temp = temp.Where("valid_to IS NULL").Order("products.created_at DESC")
				} else if *input.OrderBy == "highest-price" {
					temp = temp.Where("valid_to IS NULL").Order("price DESC")
				} else if *input.OrderBy == "lowest-price" {
					temp = temp.Where("valid_to IS NULL").Order("price ASC")
				}
			}

			if input.CreatedAtRange != nil {
				temp = temp.Where("valid_to IS NULL").Where("DATEDIFF(NOW(), products.created_at) <= ?", *input.CreatedAtRange)
			}

		}
	}

	if limit != nil {
		temp = temp.Where("valid_to IS NULL").Limit(*limit)
	}

	if offset != nil {
		temp = temp.Where("valid_to IS NULL").Offset(*offset)

	}

	return models, temp.Where("valid_to IS NULL").Find(&models).Error
}

// RecommendedProducts is the resolver for the recommendedProducts field.
func (r *queryResolver) RecommendedProducts(ctx context.Context, limit *int, offset *int) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented: Product - product"))
}

// Brands is the resolver for the brands field.
func (r *queryResolver) Brands(ctx context.Context, topSold bool) ([]*model.ProductBrand, error) {
	db := config.GetDB()

	var models []*model.ProductBrand
	if !topSold {
		return models, db.Find(&models).Error
	} else {
		return models, db.Raw("SELECT pb.* FROM product_brands pb LEFT JOIN products p ON pb.id = p.brand_id LEFT JOIN transaction_details td ON p.id = td.product_id GROUP BY pb.id ORDER BY COALESCE(SUM(td.quantity), 0) DESC").Scan(&models).Error
	}
}

// UserSearches is the resolver for the userSearches field.
func (r *queryResolver) UserSearches(ctx context.Context, limit *int) ([]*model.UserSearch, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token not found",
		}
	}

	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var searches []*model.UserSearch

	query := db.Where("user_id = ?", userId).Order("created_at DESC")
	if limit != nil && *limit > 0 {
		query = query.Limit(*limit)
	}

	if err := query.Find(&searches).Error; err != nil {
		return nil, err
	}

	return searches, nil
}

// PopularSearches is the resolver for the popularSearches field.
func (r *queryResolver) PopularSearches(ctx context.Context, limit *int) ([]*model.SearchQuery, error) {
	db := config.GetDB()

	// Use the provided limit or set a default limit of 10
	var l int
	if limit == nil {
		l = 10
	} else {
		l = *limit
	}

	// Query for the most popular search queries based on their count, and limit the results
	var searches []*model.SearchQuery
	err := db.Order("count DESC").Limit(l).Find(&searches).Error
	if err != nil {
		return nil, err
	}

	return searches, nil
}

// PromotionBanners is the resolver for the promotionBanners field.
func (r *queryResolver) PromotionBanners(ctx context.Context) ([]*model.PromotionBanner, error) {
	db := config.GetDB()

	var banners []*model.PromotionBanner
	if err := db.Find(&banners).Error; err != nil {
		return nil, err
	}

	return banners, nil
}

// User is the resolver for the user field.
func (r *userSearchResolver) User(ctx context.Context, obj *model.UserSearch) (*model.User, error) {
	db := config.GetDB()

	var user model.User

	if err := db.Where("id = ?", obj.UserID).Find(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// Search is the resolver for the search field.
func (r *userSearchResolver) Search(ctx context.Context, obj *model.UserSearch) (*model.SearchQuery, error) {
	db := config.GetDB()

	var search model.SearchQuery

	if err := db.Where("id = ?", obj.SearchID).Find(&search).Error; err != nil {
		return nil, err
	}
	return &search, nil
}

// Category returns CategoryResolver implementation.
func (r *Resolver) Category() CategoryResolver { return &categoryResolver{r} }

// Product returns ProductResolver implementation.
func (r *Resolver) Product() ProductResolver { return &productResolver{r} }

// ProductImage returns ProductImageResolver implementation.
func (r *Resolver) ProductImage() ProductImageResolver { return &productImageResolver{r} }

// UserSearch returns UserSearchResolver implementation.
func (r *Resolver) UserSearch() UserSearchResolver { return &userSearchResolver{r} }

type categoryResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type productImageResolver struct{ *Resolver }
type userSearchResolver struct{ *Resolver }
