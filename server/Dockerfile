FROM golang:1.17-alpine

WORKDIR /go/src/app
COPY . .

RUN apk upgrade --update && \
    apk --no-cache add git

RUN go mod download
RUN go get -u github.com/cosmtrek/air
RUN go build github.com/cosmtrek/air

CMD ["air"]
