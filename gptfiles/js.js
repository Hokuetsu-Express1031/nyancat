const images = Array.from({ length: 10 }, (_, i) => i + 1); // 1〜10の番号を使用
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
const timerButton = document.getElementById("timer-button");
const resetButton = document.getElementById("reset-button");
const timerDisplay = document.getElementById("timer-display");
const scoreDisplay = document.getElementById("score-display");

let intervals = []; // 各スロットのインターバルを保持
let isSpinning = [false, false, false]; // 各スロットの回転状態を保持
let positions = [0, 0, 0]; // スロットの現在位置を保持
let isTimerRunning = false; // タイマーの状態
let timerDuration = 0; // タイマーの秒数
let elapsedTime = 0; // 経過時間
let score = 0; // スコア
let timerToggleFlag = false; // タイマーのスタート・ストップ用フラグ

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

function initializeSlots() {
    slotElements.forEach((slot, index) => {
        const ctx = slot.getContext("2d");
        const image = createImageCanvas(images[0]);
        ctx.drawImage(image, 0, 0, slot.width, slot.height);
    });
}

function drawSlot(slotIndex, position) {
    const ctx = slotElements[slotIndex].getContext("2d");
    const slotHeight = slotElements[slotIndex].height;
    const slotWidth = slotElements[slotIndex].width;

    ctx.clearRect(0, 0, slotWidth, slotHeight);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, slotWidth, slotHeight);

    for (let i = -1; i <= 1; i++) {
        const imageIndex = (position + i + images.length) % images.length;
        const y = (i + 1) * (slotHeight / 3) + 205; // 205px下に描画
        const image = createImageCanvas(images[imageIndex]);
        ctx.drawImage(image, (slotWidth - 128) / 2, y - (slotHeight / 3), 128, 128);
    }
}

function rotateSlot(slotIndex) {
    let lastTime = 0;

    function animate(time) {
        if (lastTime === 0) lastTime = time;
        const deltaTime = time - lastTime;

        // 回転速度を遅くするための条件
        if (deltaTime >= 50) { // 50msごとにスロットの位置を更新
            positions[slotIndex] = (positions[slotIndex] + 1) % images.length;
            drawSlot(slotIndex, positions[slotIndex]);
            lastTime = time;
        }

        if (isSpinning[slotIndex]) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function startSpin() {
    if (!isTimerRunning) return; // タイマーが動いていないときはスロットをスタートしない
    if (isSpinning.some(spin => spin)) return; // 既に回転中なら何もしない

    isSpinning = [true, true, true]; // 全てのスロットを回転状態に
    startButton.disabled = true; // スタートボタンを無効にする
    startButton.style.backgroundColor = "#555"; // スタートボタンの色を変更

    stopButtons.forEach(button => {
        button.disabled = false; // ストップボタンを有効にする
        button.style.backgroundColor = "red"; // ストップボタンの色を赤に設定
    });

    slotElements.forEach((slot, index) => {
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
}

function startTimer() {
    isTimerRunning = true; // タイマーを開始
    updateButtonColors(); // ボタンの色を更新
    intervals.push(setInterval(() => {
        elapsedTime++; // 経過時間をカウントアップ
        updateTimerDisplay();
    }, 1000));
}

function stopTimer() {
    isTimerRunning = false; // タイマーを停止
    clearInterval(intervals.pop());
    updateButtonColors(); // ボタンの色を更新
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

function checkScore() {
    const secondRowValues = [positions[0], positions[1], positions[2]];
    if (secondRowValues[0] === secondRowValues[1] && secondRowValues[1] === secondRowValues[2]) {
        score += 2; // スコアを2倍にする
    }
    scoreDisplay.innerText = "保有コイン数: " + score;
}

// スロットのストップボタンが押されたときの処理
function handleStopButton(index) {
    isSpinning[index] = false; // スロットの回転を停止
    stopButtons[index].style.backgroundColor = "#555"; // ストップボタンの色を変更
    checkIfAllStopped(); // すべてのストップボタンが押されたか確認
    checkScore(); // スコアを更新
}

// すべてのストップボタンが押されたか確認
function checkIfAllStopped() {
    if (isSpinning.every(spin => !spin)) {
        startButton.disabled = false; // スタートボタンを有効にする
        startButton.style.backgroundColor = "green"; // スタートボタンの色を緑に設定
        stopButtons.forEach(button => button.disabled = true); // ストップボタンを無効化
    }
}

// イベントリスナーの設定
startButton.addEventListener("click", startSpin);
stopButtons.forEach((button, index) => {
    button.addEventListener("click", () => handleStopButton(index));
});
timerButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetGame);

// 初期化
initializeSlots();
updateTimerDisplay(); // 初期状態のタイマー表示を更新
resetGame(); // 初期状態をリセット
