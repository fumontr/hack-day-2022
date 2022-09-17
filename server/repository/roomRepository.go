package repository

import (
	"cloud.google.com/go/firestore"
	"context"
	"furiko/hack-day-2022/model"
	"google.golang.org/api/iterator"
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

func GetRoomById(ctx context.Context, id string) (*model.Room, error) {
	rsnap, err := client.Collection("rooms").Doc(id).Get(ctx)
	if err != nil {
		log.Errorf(ctx, "get room by id failed: %v", err)
		return nil, err
	}

	var r model.Room
	if err = rsnap.DataTo(&r); err != nil {
		log.Errorf(ctx, "bind room failed: %v", err)
		return nil, err
	}

	return &r, nil
}

func UpdateUserCountInRoom(ctx context.Context, id, path string, num int) error {
	_, err := client.Collection("rooms").Doc(id).Update(ctx, []firestore.Update{
		{
			Path:  path,
			Value: num,
		},
	})

	if err != nil {
		log.Errorf(ctx, "update room data failed: %v", err)
		return err
	}

	return nil
}

func DeleteRoom(ctx context.Context, id string) error {
	_, err := client.Collection("rooms").Doc(id).Delete(ctx)
	if err != nil {
		log.Errorf(ctx, "delete room %v failed", id)
		return err
	}
	return nil
}

func GetRooms(ctx context.Context) ([]model.Room, error) {
	iter := client.Collection("rooms").Documents(ctx)
	var resp []model.Room
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Errorf(ctx, "get all dlog error: %v", err)
			break
		}
		var d model.Room
		err = doc.DataTo(&d)
		if err != nil {
			log.Errorf(ctx, "bind to dlog error: %v", err)
			continue
		}
		resp = append(resp, d)
	}
	return resp, nil
}
