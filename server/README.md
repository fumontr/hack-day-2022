# 現在BackendのProdはデプロイされていません
開発環境をローカルで立ち上げて動かすことはできますが、2人以上プレイは現在遊べません。

<details>
<summary>過去のREADME</summary>

# server

パンの耳のバックエンドです。

## API
- POST /rooms
  - 部屋新規作成
  - ResponseでRoomId, Passwordを返す
- POST /rooms/:id/join
  - RoomIdを渡して部屋に入る。
  - jsonで新規作成時に受け取ったpasswordを渡す必要あり
- POST /rooms/:id/exit
  - RoomIdを渡して部屋から出る。
  - 0人以下になる場合はエラーを返す。
- DELETE /rooms/:id
  - 必要無くなった部屋を削除する。

## Local 起動方法
- 前提条件
  - Golang 1.18
  - [wscat](https://www.npmjs.com/package/wscat)
  - [httpie](https://httpie.io/docs/cli/installation)

### 事前準備
```
# wscatを入れる
npm install -g wscat

# httpieを入れる
brew update
brew install httpie
```

- 環境変数を設定
  - Dev: development

### サーバの起動
```bash
make build
make run
```

### サーバを叩いてみる
- REST
```bash
http :8080/ # httpieの利用を想定
```

- Websocket
```bash
wscat -c ws://localhost:8080/ws # wscatの利用を想定    
```

</details>