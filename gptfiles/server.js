const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // CORSをインポート

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORSの設定を追加
app.use(cors({
    origin: '*', // すべてのオリジンを許可
    methods: ['GET', 'POST'], // 許可するHTTPメソッド
    allowedHeaders: ['Content-Type'] // 許可するヘッダー
}));

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('scoreUpdate', (data) => {
        console.log('Score updated:', data);
        // クライアントにスコアの更新を返す
        socket.emit('scoreUpdate', { score: data.score });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
