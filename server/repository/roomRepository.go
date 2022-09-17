package repository

import (
	"context"
	"furiko/hack-day-2022/model"
	"google.golang.org/appengine/log"
)

func InsertRoom(ctx context.Context, r model.Room) (*model.Room, error) {
	_, err := client.Collection("rooms").Doc(r.ID).Set(ctx, r)

	if err != nil {
		log.Errorf(ctx, "insert room failed: %v", err)
		return nil, err
	}

	return &r, nil
}
