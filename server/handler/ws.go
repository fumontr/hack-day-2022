package handler

import (
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"log"
)

var (
	upgrader = websocket.Upgrader{}
)

func Ws(c echo.Context) error {
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
