package model

import "github.com/gorilla/websocket"

type Movement struct {
	UserId     string `json:"user_id"`
	PositionX  string `json:"position_x"`
	RoomStatus string `json:"room_status"` // Playing, Success, Failed
	Ball       Ball   `json:"ball"`
}

type Ball struct {
	PositionX string `json:"position_x"`
	PositionY string `json:"position_y"`
}

type Connection struct {
	RoomID string          `json:"room_id"`
	Conn   *websocket.Conn `json:"conn"`
}

type Connections []Connection
