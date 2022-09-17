package model

type Room struct {
	ID string `json:"id" firestore:"id,omitempty"`
}
