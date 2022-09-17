# server

パンの耳のバックエンドです。

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
