// スロットごとの画像の順番を指定する配列
const orderArray = [
    [1,2,3,4,1,5,2,6,1,7,2,1,4,3,1,5,2,6,4,2,1,7,2,1,4,5,1,6,3,1,2,4,1,2,1,7,5,2,6,4,1], // スロット1の画像順
    [1,2,3,4,1,5,2,6,1,7,2,1,4,3,2,5,2,6,4,3,1,7,2,1,4,5,2,6,3,1,2,4,1,2,1,7,5,2,6,4,2], // スロット2の画像順
    [1,2,3,4,1,5,2,6,1,7,2,1,4,3,2,5,2,6,4,3,1,7,2,1,4,5,2,6,3,1,2,4,1,2,1,7,5,2,6,4,2]  // スロット3の画像順 44
];

// orderArrayに基づき画像を生成
const images = orderArray.flat().map(number => `image/${number}.png`); // 各画像のパスを生成

const slotElements = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3")
];

const startButton = document.getElementById("start-button");
const stopButtons = [
    document.getElementById("stop-button-1"),
    document.getElementById("stop-button-2"),
    document.getElementById("stop-button-3")
];
const intoButton = document.getElementById("into-button");

const loadedImages = []; // 画像を格納する配列

// ゲームの初期化
const timerButton = document.getElementById("timer-button");
const resetButton = document.getElementById("reset-button");
const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");
const updateInterval = 50;

let intervals = []; // 各スロットのインターバルを保持
let isSpinning = [false, false, false]; // 各スロットの回転状態を保持
let positions = [0, 0, 0]; // スロットの現在位置を保持
let isTimerRunning = false; // タイマーの状態
let timerDuration = 0; // タイマーの秒数
//let elapsedTime = 0; // 経過時間
//let score = 0; // スコア
let timerToggleFlag = false; // タイマーのスタート・ストップ用フラグ
let stopCount = 0; 

function createImageCanvas(number) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = 128; // 幅を128pxに設定
    imageCanvas.height = 128; // 高さも128pxに設定
    const ctx = imageCanvas.getContext("2d");

    ctx.fillStyle = "white"; // 背景を白色に設定
    ctx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

    ctx.fillStyle = "black";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, imageCanvas.width / 2, imageCanvas.height / 2);

    return imageCanvas;
}

function preloadImages() {
    return new Promise((resolve) => {
        let imagesLoaded = 0;

        images.forEach((src, index) => {
            const img = new Image();
            img.src = src; // 画像のパスを設定
            img.onload = () => {
                loadedImages[index] = img; // 画像を読み込んだら格納
                console.log(`Loaded image: ${src}`); // 読み込んだ画像のパスを表示
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    resolve(); // すべての画像が読み込まれたら解決
                }
            };
            
        });
    });
}

function initializeSlots() {
    slotElements.forEach((slot, slotIndex) => {
        const ctx = slot.getContext("2d");
        const slotImages = orderArray[slotIndex]; // 現在のスロットの画像順を取得

        // 各スロットに対応する画像を描画
        slotImages.forEach((imageIndex, index) => {
            ctx.drawImage(loadedImages[images.indexOf(`image/${imageIndex}.png`)], 
                          0, 
                          index * (slot.height / 3), // 高さに基づいて配置
                          slot.width, 
                          slot.height / 3);
        });
    });
}





function updateSlots() {
    for (let i = 0; i < slotElements.length; i++) {
        const ctx = slotElements[i].getContext("2d");
        const slotHeight = slotElements[i].height;
        const slotWidth = slotElements[i].width;

        // 背景を白色で塗りつぶす
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, slotWidth, slotHeight);

        for (let j = -1; j <= 1; j++) {
            const imageIndex = (positions[i] + j + images.length) % images.length;
            const y = (j + 1) * (slotHeight / 3) + 195; // 画像を均等に配置
            ctx.drawImage(loadedImages[imageIndex],
                          (slotWidth - 128) / 2,
                          y - (slotHeight / 3),
                          128, 128);
        }
    }
}

// スロットの描画を更新するためのインターバル設定
setInterval(() => {
    if (isSpinning.some(spin => spin)) { // どれかのスロットが回転中であれば
        for (let i = 0; i < slotElements.length; i++) {
            if (isSpinning[i]) {
                positions[i] = (positions[i] + 1) % images.length; // 画像のインデックス更新
            }
        }
        updateSlots(); // スロットの描画を更新
    }
}, updateInterval); // 定期的に描画を更新

function startSpin() {
    if (score <= 0) {
        alert('お金を入れてね');
        return;} 
    if (!isTimerRunning) return; // タイマーが動いていないときはスロットをスタートしない
    if (isSpinning.some(spin => spin)) return; // 既に回転中なら何もしない
    score -= 1;
    scoreDisplay.innerText = "保有コイン数: " + score;
    isSpinning = [true, true, true]; // 全てのスロットを回転状態に
    startButton.disabled = true; // スタートボタンを無効にする
    stopCount = 0; 
    startButton.style.backgroundColor = "#555"; // スタートボタンの色を変更

    stopButtons.forEach(button => {
        button.disabled = false; // ストップボタンを有効にする
        button.style.backgroundColor = "red"; // ストップボタンの色を赤に設定
    });

    loadedImages.forEach((slot, index) => {
        rotateSlot(index); // 各スロットを回転開始
    });
}

function toggleTimer() {
    if (timerToggleFlag) {
        stopTimer(); // タイマーを停止
    } else {
        startTimer(); // タイマーを開始
    }
    timerToggleFlag = !timerToggleFlag; // フラグのトグル
    resetButton.disabled = false;
    resetButton.style.backgroundColor = "#FFA500" ; // オレンジ
    syncData();
}

function startTimer() {
    isTimerRunning = true; // タイマーを開始
    
    updateButtonColors(); // ボタンの色を更新
    intervals.push(setInterval(() => {
        elapsedTime++; // 経過時間をカウントアップ
        updateTimerDisplay();
    }, 1000));
    syncData();
}

function stopTimer() {
    isTimerRunning = false; // タイマーを停止
    clearInterval(intervals.pop());
    updateButtonColors(); // ボタンの色を更新
    syncData();
}

function resetGame() {
    elapsedTime = 0; // 経過時間を初期化
    score = 0; // スコアを初期化
    updateTimerDisplay();
    scoreDisplay.innerText = "保有コイン数: " + score;

    // スロットをリセット
    isSpinning = [false, false, false];
    positions = [0, 0, 0];
    startButton.disabled = true; // スタートボタンを無効化
    startButton.style.backgroundColor = "#555"; // スタートボタンの色を変更
    stopButtons.forEach(button => {
        button.disabled = true; // ストップボタンを無効化
        button.style.backgroundColor = "#555"; // ストップボタンの色を変更
    });
    resetButton.disabled = true; // リセットボタンを無効化
    stopTimer();
    elapsedTime = 0;
    timerToggleFlag = !timerToggleFlag;
    initializeSlots(); // スロットの初期状態を描画
    drawSlot(0, 0); // 初期状態を描画
    drawSlot(1, 0);
    drawSlot(2, 0);
}

function updateTimerDisplay() {
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    timerDisplay.innerText = `${minutes}:${seconds}`; // タイマー表示を更新
}

function updateButtonColors() {
    // ボタンの色を更新する
    timerButton.style.backgroundColor = isTimerRunning ? "#00BFFF" : "green"; // タイマーが動いているときは水色、止まっているときは緑
    resetButton.style.backgroundColor = elapsedTime === 0 ? "#FFA500" : "#555"; // オレンジ
    resetButton.disabled = elapsedTime !== 0; // 経過時間が0でないときは無効にする

    // スタートボタンを有効にする条件
    startButton.disabled = !(isTimerRunning && stopButtons.every(button => button.disabled)); // タイマーが動いているかつすべてのストップボタンが押された場合
    startButton.style.backgroundColor = startButton.disabled ? "#555" : "green"; // 押せないときはグレー、押せるときは緑
}

// スロットのストップボタンが押されたときの処理
function handleStopButton(index) {
    isSpinning[index] = false; // スロットの回転を停止
    stopButtons[index].style.backgroundColor = "#555"; // ストップボタンの色を変更
    checkIfAllStopped(); // すべてのストップボタンが押されたか確認
}

// すべてのストップボタンが押されたか確認
function checkIfAllStopped() {
    if (isSpinning.every(spin => !spin)) {
        startButton.disabled = false; // スタートボタンを有効にする
        startButton.style.backgroundColor = "green"; // スタートボタンの色を緑に設定
        stopButtons.forEach(button => button.disabled = true); // ストップボタンを無効化
        stopCount = 0; // スペースキー押下回数をリセット
        checkScore(); // スコアを更新
    }
}

function handleKeyPress(event) {
    if (event.code === 'Space') {
        if (stopCount < 3 && isSpinning[stopCount]) { // 3回までスロットを停止
            handleStopButton(stopCount); // スロットを停止
            stopCount++; // 次のスロットに進むためカウントを増加
        }
    }
    if (event.code === 'KeyB') {
        startSpin();
    }
}

function IntoCoin() {
    score += 5; // スコアを2倍にする
    scoreDisplay.innerText = "保有コイン数: " + score;
}


// イベントリスナーの設定
startButton.addEventListener("click", startSpin);
stopButtons.forEach((button, index) => {
    button.addEventListener("click", () => handleStopButton(index));
});
document.addEventListener('keydown', handleKeyPress);
timerButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetGame);
intoButton.addEventListener("click", IntoCoin)


// 初期化
preloadImages().then(() => {
    initializeSlots(); // 画像が読み込まれた後にスロットを初期化
});
updateTimerDisplay(); // 初期状態のタイマー表示を更新
resetGame(); // 初期状態をリセット
initializeSlots(); // スロットの初期状態を描画
drawSlot(0, 0); // 初期状態を描画
drawSlot(1, 0);
drawSlot(2, 0);
