package handler

import (
	"furiko/hack-day-2022/model"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

var (
	upgrader  = websocket.Upgrader{}
	broadcast = make(chan model.Movement)
	clients   = make(map[model.Connection]bool)
)

func WebsocketSample(c echo.Context) error {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
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

func ConnectWebsocket(c echo.Context) error {
	id := c.Param("id")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Print("upgrade:", err)
		return nil
	}
	defer ws.Close()

	clients[model.Connection{RoomID: id, Conn: ws}] = true

	for {
		var movement model.Movement
		err = ws.ReadJSON(&movement)
		if err != nil {
			log.Println("connection closed from client:", err)
			break
		}
		broadcast <- movement
	}
	return nil
}

func HandleMessage() {
	for {
		// broadcastチャネルからメッセージを受け取る
		message := <-broadcast
		// 接続中の全クライアントにメッセージを送る
		for client := range clients {
			err := client.Conn.WriteJSON(message)
			if err != nil {
				log.Printf("error: %v", err)
				client.Conn.Close()
				delete(clients, client)
			}
		}
	}
}
