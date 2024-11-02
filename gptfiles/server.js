const express = require('express');
const cors = require('cors'); // CORSミドルウェアをインポート
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS設定を追加
app.use(cors({
    origin: '*', // どのオリジンからのリクエストも許可
}));

const PORT = 3000;

// 静的ファイルの提供
app.use(express.static('public'));

// ソケット通信の設定
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// サーバーの起動
server.listen(PORT,() => { // '0.0.0.0' で全てのインターフェースにバインド
    console.log(`Server is running on http://localhost:${PORT}`);
});
