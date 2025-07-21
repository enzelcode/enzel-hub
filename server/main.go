package main

import (
	"log"

	"github.com/enzelcode/enzel-hub/internal/config"
	"github.com/enzelcode/enzel-hub/internal/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env não encontrado ou não carregado")
	}

	config.ConnectMongoDB()

	app := fiber.New()

	routes.PingRoute(app)

	log.Fatal(app.Listen(":3000"))
}
