package handler

import (
	"context"
	"furiko/hack-day-2022/model"
	"furiko/hack-day-2022/service"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

func CreateRoom(c echo.Context) error {
	ctx := context.Background()
	id := IssueId()
	r := model.Room{
		ID: id,
	}
	resp, err := service.CreateRoom(ctx, r)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, resp)
}

func IssueId() string {
	id, err := uuid.NewRandom()
	if err != nil {
		log.Println("error creating issue id")
	}
	return id.String()
}
