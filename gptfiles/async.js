
const socket = io("http://192.168.11.50:3000"); // Socket.IOサーバーと接続

// クライアントのデータ
let score = 0; // コイン保有数
let elapsedTime = 0; // タイマーの経過時間

// サーバーにデータを送信する関数
function syncData() {
    socket.emit("syncData", { score, elapsedTime });
}

// スロットマシンのイベントやタイマーの更新ごとに同期
function updateScore(newScore) {
    score = newScore;
    syncData();
}

function updateElapsedTime(newTime) {
    elapsedTime = newTime;
    syncData();
}

// 必要に応じてエクスポート
//export { syncData, updateScore, updateElapsedTime };
