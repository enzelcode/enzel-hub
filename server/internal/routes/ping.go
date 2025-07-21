package routes

import (
	"github.com/enzelcode/enzel-hub/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func PingRoute(app *fiber.App) {
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "pong"})
	})

	app.Get("/private", middleware.AuthMiddleware, func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "rota protegida",
			"user":    c.Locals("user_email"),
		})
	})
}
