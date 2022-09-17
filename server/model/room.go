package model

type Room struct {
	ID        string `json:"id" firestore:"id,omitempty"`
	UserCount int    `json:"user_count" firestore:"user_count,omitempty"`
	Password  string `json:"password" firestore:"password,omitempty"`
	Status    string `json:"status" firestore:"status,omitempty"`
	Users     []User `json:"users" firestore:"users,omitempty"`
}

type CreteRoomRequest struct {
	Password string `json:"password"`
}

type ExitRoomRequest struct {
	UserID string `json:"user_id"`
}

type JoinRoomResponse struct {
	Room
	User User `json:"user"`
}
