// asyncHTTP.js

const url = 'http://153.125.129.24';
// 非同期通信を行う関数
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('通信エラー:', error);
        throw error;
    }
}

// フォームの内容をサーバーに送信し、レスポンスを表示する関数
async function sendUserData() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    // 入力内容をオブジェクトにまとめる
    const userData = { name: name, age: Number(age) };

    try {
        const result = await postData(url, userData);
        // サーバーからのレスポンスをHTMLに適用
        document.getElementById('response').innerText = result.message;
    } catch (error) {
        console.error('データ送信エラー:', error);
        document.getElementById('response').innerText = 'データ送信に失敗しました';
    }
}

async function sendStartTime() {
    const url = 'http://153.125.129.24';
    
    
}

async function sendScoreDate() {
    const scoredate = {scores: score};

    try {
        const result = await postData(url, scoredate);
    }catch{
        
    }
}