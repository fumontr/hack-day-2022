package repository

import (
	"cloud.google.com/go/firestore"
	"context"
	firebase "firebase.google.com/go"
	"log"
)

var (
	client *firestore.Client
)

// InitClient : Create Connection When App Start
func InitClient() {
	ctx := context.Background()
	//sa := option.WithCredentialsFile("_secret/hack-day-2022-362804-firebase-adminsdk-1dd8o-c3b9ef1bbb.json")
	//conf := &firebase.Config{ProjectID: "hack-day-2022-362804"}
	app, err := firebase.NewApp(ctx, nil)

	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	c, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln("Error initializing database client: ", err)
	}
	client = c
}
