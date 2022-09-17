package main

import (
	"furiko/hack-day-2022/handler"
	"furiko/hack-day-2022/repository"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
)

func main() {
	addr := ":8080"
	e := echo.New()
	repository.InitClient()
	// テスト用
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!")
	})

	// ws
	{
		e.GET("/ws", handler.Ws)
	}

	// room
	{
		e.POST("/rooms", handler.CreateRoom)
	}

	// 環境変数からEnvを取得する
	// HotLoadで煩わしいアラートを回避する用
	env := os.Getenv("Env")
	if env == "development" {
		addr = "127.0.0.1" + addr
	}

	e.Logger.Fatal(e.Start(addr))
}
