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
let intervals = []; // 各スロットのインターバルを保持
let isSpinning = [false, false, false]; // 各スロットの回転状態を保持
let positions = [0, 0, 0]; // スロットの現在位置を保持
let timerInterval; // タイマーのインターバルを保持
let timeLeft = 300; // タイマーの時間を秒で設定（5分）

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

// スロットの描画を行い、3枚の画像を常に表示
function drawSlot(slotIndex, position) {
    const ctx = slotElements[slotIndex].getContext("2d");
    const slotHeight = slotElements[slotIndex].height;
    const slotWidth = slotElements[slotIndex].width;

    // スロットのキャンバスをクリア
    ctx.clearRect(0, 0, slotWidth, slotHeight);

    // 背景を白色で塗りつぶす
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, slotWidth, slotHeight);

    // 常に3枚の画像を描画する
    for (let i = -1; i <= 1; i++) {
        const imageIndex = (position + i + images.length) % images.length; // インデックスの範囲を循環
        const y = (i + 1) * (slotHeight / 3) + 200; // 200px下げて描画
        const image = createImageCanvas(images[imageIndex]);
        ctx.drawImage(image, (slotWidth - 128) / 2, y - (slotHeight / 3), 128, 128); // 中央に描画
    }
}

function rotateSlot(slotIndex) {
    let lastTime = 0;

    function animate(time) {
        if (lastTime === 0) lastTime = time;
        const deltaTime = time - lastTime;

        if (deltaTime >= 16) { // 60fps以上を維持するための計算
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
    if (isSpinning.some(spin => spin)) return; // 既に回転中なら何もしない

    isSpinning = [true, true, true]; // 全てのスロットを回転状態に
    startButton.disabled = true; // スタートボタンを無効にする

    // ストップボタンを再度有効にする
    stopButtons.forEach(button => button.disabled = false);

    slotElements.forEach((slot, index) => {
        rotateSlot(index); // 各スロットを回転開始
    });
}

function stopSlot(slotIndex) {
    isSpinning[slotIndex] = false; // 回転状態を解除
    stopButtons[slotIndex].disabled = true; // 該当のストップボタンを無効にする

    // 全スロットが停止したら、スタートボタンを再度有効にする
    if (!isSpinning.some(spin => spin)) {
        startButton.disabled = false;
    }
}

// タイマー機能
function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById("timer-display").textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.disabled = true; // タイマーが終わったらスタートボタンを無効に
            stopButtons.forEach(button => button.disabled = true); // ストップボタンも無効に
        }
    }, 1000);
}

function toggleTimer() {
    if (!timerInterval) {
        startButton.disabled = false; // タイマーがスタートするまでスロットのスタートボタンを有効に
        startTimer();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startButton.disabled = true; // タイマーを停止するとスタートボタンを無効に
    }
}

// ストップボタンのイベントリスナーを設定
stopButtons.forEach((button, index) => {
    button.addEventListener("click", () => stopSlot(index));
});

startButton.addEventListener("click", startSpin);
document.getElementById("timer-button").addEventListener("click", toggleTimer);

// 初期化関数の呼び出し
initializeSlots();
drawSlot(0, 0); // スロットの初期状態を描画
drawSlot(1, 0);
drawSlot(2, 0);
updateTimerDisplay(); // タイマー表示を初期化

// スロットのスタートボタンをデフォルトで無効にする
startButton.disabled = true;
