package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"

	"github.com/jxsr12/oldegg/config"
	"github.com/jxsr12/oldegg/directives"
	"github.com/jxsr12/oldegg/graph"
	"github.com/jxsr12/oldegg/graph/model"
	middlewares "github.com/jxsr12/oldegg/middleware"
	ws "github.com/jxsr12/oldegg/websocket"
	"github.com/rs/cors"
)

const defaultPort = "8080"

var allowOriginFunc = func(r *http.Request) bool {
	return true
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := config.GetDB()

	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.Shop{})
	db.AutoMigrate(&model.ProductBrand{})
	db.AutoMigrate(&model.ProductGroup{})
	db.AutoMigrate(&model.ProductImage{})
	db.AutoMigrate(&model.Review{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.Wishlist{})
	db.AutoMigrate(&model.WishlistItem{})
	db.AutoMigrate(&model.TransactionHeader{})
	db.AutoMigrate(&model.TransactionDetail{})
	db.AutoMigrate(&model.Address{})
	db.AutoMigrate(&model.Shipment{})
	db.AutoMigrate(&model.PaymentMethod{})
	db.AutoMigrate(&model.CreditVoucher{})
	db.AutoMigrate(&model.ReviewCredit{})
	db.AutoMigrate(&model.WishlistFollowing{})
	db.AutoMigrate(&model.WishlistComment{})
	db.AutoMigrate(&model.SearchQuery{})
	db.AutoMigrate(&model.UserSearch{})
	db.AutoMigrate(&model.PromotionBanner{})
	db.AutoMigrate(&model.SupportChatReview{})
	db.AutoMigrate(&model.SupportChat{})
	db.AutoMigrate(&model.UserChat{})
	db.AutoMigrate(&model.Notification{})
	err := db.AutoMigrate(&model.SupportMessage{})
	if err != nil {
		log.Println(err)
	}
	err = db.AutoMigrate(&model.UserMessage{})
	if err != nil {
		log.Println(err)
	}

	router := mux.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler, middlewares.AuthMiddleware)

	router.Use(middlewares.AuthMiddleware)

	c := graph.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	pool := ws.NewPool()

	go pool.Start()

	log.Printf("Go to http://localhost:%s/ for GraphQL playground", port)
	log.Printf("API Endpoint: http://localhost:%s/query", port)

	log.Fatal(http.ListenAndServe(":"+port, router))

}
