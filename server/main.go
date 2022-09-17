package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
)

func main() {
	addr := ":8080"
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!")
	})

	env := os.Getenv("Env")
	if env == "development" {
		addr = "127.0.0.1" + addr
	}
	e.Logger.Fatal(e.Start(addr))
}
