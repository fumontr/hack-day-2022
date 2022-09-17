package service

import (
	"context"
	"furiko/hack-day-2022/model"
	"furiko/hack-day-2022/repository"
)

func CreateRoom(ctx context.Context, r model.Room) (*model.Room, error) {
	resp, err := repository.InsertRoom(ctx, r)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
