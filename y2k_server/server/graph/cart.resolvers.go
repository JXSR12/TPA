package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/graph/model"
	"github.com/jxsr12/oldegg/service"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

// User is the resolver for the user field.
func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// Product is the resolver for the product field.
func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", obj.ProductID).Order("valid_to ASC").Limit(1).Find(&product).Error
}

// CreateCart is the resolver for the createCart field.
func (r *mutationResolver) CreateCart(ctx context.Context, productID string, quantity int, notes string) (*model.Cart, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	cart, _ := service.CartGetByUserProduct(ctx, userID, productID)

	if cart != nil {
		cart.Quantity += quantity
		cart.Notes = notes

		return cart, db.Save(cart).Error
	}
	return service.CartCreate(ctx, userID, productID, quantity, notes)
}

// UpdateCart is the resolver for the updateCart field.
func (r *mutationResolver) UpdateCart(ctx context.Context, productID string, quantity int, notes string) (*model.Cart, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	cart, _ := service.CartGetByUserProduct(ctx, userID, productID)

	if cart == nil {
		return nil, &gqlerror.Error{
			Message: "Error, cart gaada",
		}
	}
	if quantity > 0 {
		cart.Quantity = quantity
		// cart.Notes = notes

		return cart, db.Save(cart).Error
	}
	return cart, db.Delete(cart).Error
}

// DeleteCart is the resolver for the deleteCart field.
func (r *mutationResolver) DeleteCart(ctx context.Context, productID string) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	model := new(model.Cart)
	if err := db.First(model, "user_id = ? AND product_id = ?", userID, productID).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// CreateWishlistComment is the resolver for the createWishlistComment field.
func (r *mutationResolver) CreateWishlistComment(ctx context.Context, wishlistID string, content *string) (*model.WishlistComment, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlistComment := &model.WishlistComment{
		ID:         uuid.New().String(),
		Date:       time.Now(),
		Content:    *content,
		WishlistID: wishlistID,
		UserID:     userID,
	}

	if err := db.Create(&wishlistComment).Error; err != nil {
		return nil, err
	}

	if err := db.Preload("User").First(&wishlistComment, "id = ?", wishlistComment.ID).Error; err != nil {
		return nil, err
	}

	return wishlistComment, nil
}

// FollowWishlist is the resolver for the followWishlist field.
func (r *mutationResolver) FollowWishlist(ctx context.Context, wishlistID string) (*model.Wishlist, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var wishlistFollowing model.WishlistFollowing
	err := db.Where("user_id = ? AND wishlist_id = ?", userID, wishlistID).First(&wishlistFollowing).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			wishlistFollowing.UserID = userID
			wishlistFollowing.WishlistID = wishlistID
			err = db.Create(&wishlistFollowing).Error
			if err != nil {
				return nil, err
			}
		} else {
			return nil, err
		}
	} else {
		err = db.Where("user_id = ? AND wishlist_id = ?", userID, wishlistID).Delete(&wishlistFollowing).Error
		if err != nil {
			return nil, err
		}
	}

	var wishlist model.Wishlist
	err = db.Where("id = ?", wishlistID).First(&wishlist).Error
	if err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// CreateWishlist is the resolver for the createWishlist field.
func (r *mutationResolver) CreateWishlist(ctx context.Context, title string, typeArg model.WishlistType) (*model.Wishlist, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := new(model.Wishlist)

	if err := db.First(wishlist, "user_id = ? AND title = ?", userID, title); err == nil {
		return nil, &gqlerror.Error{
			Message: "Error, nama tidak unik",
		}
	}

	wishlist = &model.Wishlist{
		ID:           uuid.NewString(),
		UserID:       userID,
		WishlistType: typeArg,
		Title:        title,
	}

	return wishlist, db.Create(wishlist).Error
}

// CreateWishlistItem is the resolver for the createWishlistItem field.
func (r *mutationResolver) CreateWishlistItem(ctx context.Context, wishlistID string, productID string) (*model.WishlistItem, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	wi := new(model.WishlistItem)

	if err := db.First(wi, "wishlist_id = ? AND product_id = ?", wishlistID, productID).Error; err == nil {
		return wi, nil
	}

	wi = &model.WishlistItem{
		WishlistID: wishlistID,
		ProductID:  productID,
	}

	if err := db.Create(wi).Error; err != nil {
		return nil, err
	}

	return wi, nil
}

// UpdateWishlist is the resolver for the updateWishlist field.
func (r *mutationResolver) UpdateWishlist(ctx context.Context, id string, title string, typeArg model.WishlistType) (*model.Wishlist, error) {
	db := config.GetDB()

	// Ensure user is authenticated
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}
	userId := ctx.Value("auth").(*service.JwtCustomClaim).ID

	// Get the wishlist associated with the user
	var wishlist model.Wishlist
	err := db.Where("id = ? AND user_id = ?", id, userId).First(&wishlist).Error
	if err != nil {
		return nil, err
	}

	// Update the wishlist
	wishlist.Title = title
	wishlist.WishlistType = typeArg
	err = db.Save(&wishlist).Error
	if err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// DeleteWishlist is the resolver for the deleteWishlist field.
func (r *mutationResolver) DeleteWishlist(ctx context.Context, id string) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	model := new(model.Wishlist)
	if err := db.First(model, "id = ?", id).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// DeleteWishlistItem is the resolver for the deleteWishlistItem field.
func (r *mutationResolver) DeleteWishlistItem(ctx context.Context, wishlistID string, productID string) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	result := db.Exec("DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?", wishlistID, productID)
	if result.Error != nil {
		return false, result.Error
	}

	if result.RowsAffected == 0 {
		return false, fmt.Errorf("wishlist item not found")
	}

	return true, nil
}

// DuplicateWishlistItems is the resolver for the duplicateWishlistItems field.
func (r *mutationResolver) DuplicateWishlistItems(ctx context.Context, sourceID string, destinationID string) (*model.Wishlist, error) {
	// Ensure user is authenticated
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	// Get source wishlist items
	db := config.GetDB()
	var sourceItems []*model.WishlistItem
	if err := db.Where("wishlist_id = ?", sourceID).Find(&sourceItems).Error; err != nil {
		return nil, err
	}

	// Create new wishlist items for destination wishlist
	var destinationItems []*model.WishlistItem
	for _, item := range sourceItems {
		newItem := &model.WishlistItem{
			WishlistID: destinationID,
			ProductID:  item.ProductID,
		}
		if err := db.Create(newItem).Error; err != nil {
			return nil, err
		}
		destinationItems = append(destinationItems, newItem)
	}

	// Get destination wishlist
	var destinationWishlist model.Wishlist
	if err := db.Where("id = ?", destinationID).First(&destinationWishlist).Error; err != nil {
		return nil, err
	}

	// Update destination wishlist items and return
	destinationWishlist.Items = destinationItems
	return &destinationWishlist, nil
}

// Cart is the resolver for the cart field.
func (r *queryResolver) Cart(ctx context.Context, productID string) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented"))
}

// Carts is the resolver for the carts field.
func (r *queryResolver) Carts(ctx context.Context) ([]*model.Cart, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Cart
	return models, db.Where("user_id = ?", id).Find(&models).Error
}

// Wishlist is the resolver for the wishlist field.
func (r *queryResolver) Wishlist(ctx context.Context, id string) (*model.Wishlist, error) {
	db := config.GetDB()

	var wishlist model.Wishlist
	if err := db.Where("id = ?", id).First(&wishlist).Error; err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// Wishlists is the resolver for the wishlists field.
func (r *queryResolver) Wishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Wishlist
	return models, db.Where("user_id = ?", id).Find(&models).Error
}

// PublicWishlists is the resolver for the publicWishlists field.
func (r *queryResolver) PublicWishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()
	var models []*model.Wishlist
	return models, db.Where("wishlist_type = ?", model.WishlistTypePublic).Find(&models).Error
}

// FollowedWishlists is the resolver for the followedWishlists field.
func (r *queryResolver) FollowedWishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Wishlist
	err := db.Raw(`SELECT w.* FROM wishlists w JOIN wishlist_followings wf ON w.id = wf.wishlist_id WHERE wf.user_id = ?`, id).Scan(&models).Error
	if err != nil {
		return nil, err
	}

	return models, nil
}

// WishlistFollowers is the resolver for the wishlistFollowers field.
func (r *queryResolver) WishlistFollowers(ctx context.Context, wishlistID string) ([]*model.User, error) {
	db := config.GetDB()
	var wishlistFollowings []*model.WishlistFollowing
	if err := db.Where("wishlist_id = ?", wishlistID).Find(&wishlistFollowings).Error; err != nil {
		return nil, err
	}

	var users []*model.User
	for _, wf := range wishlistFollowings {
		var user model.User
		if err := db.First(&user, "id = ?", wf.UserID).Error; err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	return users, nil
}

// WishlistComments is the resolver for the wishlistComments field.
func (r *queryResolver) WishlistComments(ctx context.Context, wishlistID string) ([]*model.WishlistComment, error) {
	db := config.GetDB()

	var wishlistComments []*model.WishlistComment
	if err := db.Where("wishlist_id = ?", wishlistID).Order("date desc").Preload("User").Find(&wishlistComments).Error; err != nil {
		return nil, err
	}

	return wishlistComments, nil
}

// Type is the resolver for the type field.
func (r *wishlistResolver) Type(ctx context.Context, obj *model.Wishlist) (model.WishlistType, error) {
	return obj.WishlistType, nil
}

// User is the resolver for the user field.
func (r *wishlistResolver) User(ctx context.Context, obj *model.Wishlist) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// Items is the resolver for the items field.
func (r *wishlistResolver) Items(ctx context.Context, obj *model.Wishlist) ([]*model.WishlistItem, error) {
	db := config.GetDB()

	var items []*model.WishlistItem
	if err := db.Where("wishlist_id = ?", obj.ID).Find(&items).Error; err != nil {
		return nil, err
	}

	return items, nil
}

// Wishlist is the resolver for the wishlist field.
func (r *wishlistCommentResolver) Wishlist(ctx context.Context, obj *model.WishlistComment) (*model.Wishlist, error) {
	db := config.GetDB()
	var wishlist model.Wishlist
	if err := db.Where("id = ?", obj.WishlistID).Find(&wishlist).Error; err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// User is the resolver for the user field.
func (r *wishlistCommentResolver) User(ctx context.Context, obj *model.WishlistComment) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Where("id = ?", obj.UserID).Find(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// Wishlist is the resolver for the wishlist field.
func (r *wishlistFollowingResolver) Wishlist(ctx context.Context, obj *model.WishlistFollowing) (*model.Wishlist, error) {
	db := config.GetDB()
	var wishlist model.Wishlist
	if err := db.Where("id = ?", obj.WishlistID).Find(&wishlist).Error; err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// User is the resolver for the user field.
func (r *wishlistFollowingResolver) User(ctx context.Context, obj *model.WishlistFollowing) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Where("id = ?", obj.UserID).Find(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// Wishlist is the resolver for the wishlist field.
func (r *wishlistItemResolver) Wishlist(ctx context.Context, obj *model.WishlistItem) (*model.Wishlist, error) {
	db := config.GetDB()

	var wishlist model.Wishlist
	if err := db.Where("id = ?", obj.WishlistID).First(&wishlist).Error; err != nil {
		return nil, err
	}

	return &wishlist, nil
}

// Product is the resolver for the product field.
func (r *wishlistItemResolver) Product(ctx context.Context, obj *model.WishlistItem) (*model.Product, error) {
	db := config.GetDB()

	var product model.Product
	if err := db.Where("id = ?", obj.ProductID).First(&product).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

// Cart returns CartResolver implementation.
func (r *Resolver) Cart() CartResolver { return &cartResolver{r} }

// Wishlist returns WishlistResolver implementation.
func (r *Resolver) Wishlist() WishlistResolver { return &wishlistResolver{r} }

// WishlistComment returns WishlistCommentResolver implementation.
func (r *Resolver) WishlistComment() WishlistCommentResolver { return &wishlistCommentResolver{r} }

// WishlistFollowing returns WishlistFollowingResolver implementation.
func (r *Resolver) WishlistFollowing() WishlistFollowingResolver {
	return &wishlistFollowingResolver{r}
}

// WishlistItem returns WishlistItemResolver implementation.
func (r *Resolver) WishlistItem() WishlistItemResolver { return &wishlistItemResolver{r} }

type cartResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }
type wishlistCommentResolver struct{ *Resolver }
type wishlistFollowingResolver struct{ *Resolver }
type wishlistItemResolver struct{ *Resolver }
