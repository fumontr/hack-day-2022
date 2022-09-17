package model

type Room struct {
	ID        string `json:"id" firestore:"id,omitempty"`
	UserCount int    `json:"user_count" firestore:"user_count,omitempty"`
	Password  string `json:"password" firestore:"password,omitempty"`
	Status    string `json:"status" firestore:"status,omitempty"`
}

type RoomRequest struct {
	Password string `json:"password" firestore:"password,omitempty"`
}
