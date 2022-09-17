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

func GetRoomData(ctx context.Context, id string) (*model.Room, error) {
	resp, err := repository.GetRoomById(ctx, id)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func AddUserToRoom(ctx context.Context, id, path, path2 string, num int, users []model.User) error {
	if err := repository.UpdateUserCountInRoom(ctx, id, path, num); err != nil {
		return err
	}

	if err := repository.UpdateUsersInRoom(ctx, id, path2, users); err != nil {
		return err
	}
	return nil
}

func DeleteRoom(ctx context.Context, id string) error {
	if err := repository.DeleteRoom(ctx, id); err != nil {
		return err
	}
	return nil
}

func GetRooms(ctx context.Context) ([]model.Room, error) {
	rooms, err := repository.GetRooms(ctx)
	if err != nil {
		return nil, err
	}

	return rooms, err
}

func ExitUserToRoom(ctx context.Context, id, path, path2 string, num int, users []model.User) error {
	if err := repository.UpdateUsersInRoom(ctx, id, path2, users); err != nil {
		return err
	}

	if err := repository.UpdateUserCountInRoom(ctx, id, path, num); err != nil {
		return err
	}

	return nil
}
