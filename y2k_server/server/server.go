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
	"github.com/rs/cors"
)

const defaultPort = "8080"

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

	log.Printf("Go to http://localhost:%s/ for GraphQL playground", port)
	log.Printf("API Endpoint: http://localhost:%s/query", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
