package main

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"
)

var (
	upgrader = websocket.Upgrader{}
)

func ws(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Print("upgrade:", err)
		return nil
	}
	defer ws.Close()
	for {
		mt, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("connection closed from client:", err)
			break
		}
		log.Printf("recv: %s", message)
		err = ws.WriteMessage(mt, message)
		if err != nil {
			log.Println("connection closed from server:", err)
			break
		}
	}
	return nil
}

func main() {
	addr := ":8080"
	e := echo.New()
	// テスト用
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!")
	})

	// ws
	{
		e.GET("/ws", ws)
	}

	// 環境変数からEnvを取得する
	// HotLoadで煩わしいアラートを回避する用
	env := os.Getenv("Env")
	if env == "development" {
		addr = "127.0.0.1" + addr
	}

	e.Logger.Fatal(e.Start(addr))
}
