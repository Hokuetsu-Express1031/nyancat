const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// CORSの設定
app.use(cors());
app.use(express.json()); // JSONリクエストをパース

// データを保持する配列
const receivedData = [];

// クライアントからのデータを受信
app.post('/data', (req, res) => {
    const data = req.body;
    receivedData.push(data); // データを配列に保存
    console.log('データを受信:', data);
    res.status(200).send('データを受信しました');
});

// 管理ページ用エンドポイント
app.get('/admin', (req, res) => {
    // 保存されているデータをJSONで返す
    res.json(receivedData);
});

// 管理ページHTMLを提供するルート
app.get('/admin-page', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で稼働中`);
});
