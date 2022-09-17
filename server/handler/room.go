package handler

import (
	"context"
	"fmt"
	"furiko/hack-day-2022/model"
	"furiko/hack-day-2022/service"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

var (
	StatusWaiting = "Waiting"
	//StatusPlaying = "Playing"
	//StatusEnding  = "Ending"
)

func IssueId() string {
	id, err := uuid.NewRandom()
	if err != nil {
		log.Println("error creating issue id")
	}
	return id.String()
}

// TODO: パスワードを生成orユーザから受け取るようにする
func IssuePassword() string {
	return "あいうえお"
}

func CreateRoom(c echo.Context) error {
	ctx := context.Background()
	id := IssueId()
	password := IssuePassword()
	r := model.Room{
		ID:        id,
		UserCount: 1,
		Password:  password,
		Status:    StatusWaiting,
	}
	resp, err := service.CreateRoom(ctx, r)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, resp)
}

func JoinRoom(c echo.Context) error {
	ctx := context.Background()
	req := new(model.RoomRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, "request invalid")
	}

	id := c.Param("id")
	room, err := service.GetRoomData(ctx, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, fmt.Sprintf("room id invalid: %v", id))
	}

	if room.Password != req.Password {
		return c.JSON(http.StatusBadRequest, "password is wrong")
	}

	log.Printf("room: %+v", room)

	newUserCount := room.UserCount + 1
	if err = service.AddUserToRoom(ctx, room.ID, "user_count", newUserCount); err != nil {
		return c.JSON(http.StatusInternalServerError, fmt.Sprintf("join room %v failed", room.ID))
	}
	nr := model.Room{
		ID:        room.ID,
		UserCount: newUserCount,
		Password:  room.Password,
		Status:    room.Status,
	}

	return c.JSON(http.StatusOK, nr)
}

func ExitRoom(c echo.Context) error {
	ctx := context.Background()
	id := c.Param("id")
	room, err := service.GetRoomData(ctx, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, fmt.Sprintf("room id invalid: %v", id))
	}

	log.Printf("room: %+v", room)

	if room.UserCount <= 0 {
		return c.JSON(http.StatusBadRequest, fmt.Sprintf("no one exist in room %v", id))
	}

	newUserCount := room.UserCount - 1
	if err = service.AddUserToRoom(ctx, room.ID, "user_count", newUserCount); err != nil {
		return c.JSON(http.StatusInternalServerError, fmt.Sprintf("join room %v failed", room.ID))
	}

	nr := model.Room{
		ID:        room.ID,
		UserCount: newUserCount,
		Password:  room.Password,
		Status:    room.Status,
	}

	return c.JSON(http.StatusOK, nr)
}

func DeleteRoom(c echo.Context) error {
	ctx := context.Background()
	id := c.Param("id")

	if err := service.DeleteRoom(ctx, id); err != nil {
		return c.JSON(http.StatusInternalServerError, fmt.Sprintf("delete room %v failed", id))
	}

	return c.JSON(http.StatusOK, fmt.Sprintf("delete room %v success", id))
}
