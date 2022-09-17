package model

type Movement struct {
	UserId     string `json:"user_id"`
	PositionX  string `json:"position_x"`
	RoomStatus string `json:"room_status"` // Playing, Success, Failed
}
