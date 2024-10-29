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
const timerDisplay = document.getElementById("timer-display");
const timerButton = document.getElementById("start-timer");

let intervals = []; // 各スロットのインターバルを保持
let isSpinning = [false, false, false]; // 各スロットの回転状態を保持
let positions = [0, 0, 0]; // スロットの現在位置を保持
let timer; // タイマーのインターバルを保持
let timeRemaining = 5 * 60; // タイマーの初期時間（5分）
let isTimerRunning = false; // タイマーが動作中かどうかを示すフラグ

function createImageCanvas(number) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = 256;
    imageCanvas.height = 256;
    const ctx = imageCanvas.getContext("2d");

    ctx.fillStyle = "white";
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

// スロットの描画を行い、5枚の画像を常に表示
function drawSlot(slotIndex, position) {
    const ctx = slotElements[slotIndex].getContext("2d");
    const slotHeight = slotElements[slotIndex].height;
    const slotWidth = slotElements[slotIndex].width;

    ctx.clearRect(0, 0, slotWidth, slotHeight);

    for (let i = -2; i <= 2; i++) {
        const imageIndex = (position + i + images.length) % images.length;
        const y = (i + 2) * (slotHeight / 5);
        const image = createImageCanvas(images[imageIndex]);
        ctx.drawImage(image, 0, y - (slotHeight / 5), 256, 256);
    }
}

function rotateSlot(slotIndex) {
    let lastTime = 0;

    function animate(time) {
        if (lastTime === 0) lastTime = time;
        const deltaTime = time - lastTime;

        if (deltaTime >= 16) {
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
    if (isSpinning.some(spin => spin) || timeRemaining <= 0 || !isTimerRunning) return;

    isSpinning = [true, true, true];
    startButton.disabled = true;
    stopButtons.forEach(button => button.disabled = false);

    slotElements.forEach((slot, index) => {
        rotateSlot(index);
    });
}

function stopSlot(slotIndex) {
    isSpinning[slotIndex] = false;
    stopButtons[slotIndex].disabled = true;

    if (!isSpinning.some(spin => spin)) {
        startButton.disabled = false;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function toggleTimer() {
    if (isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
        timerButton.textContent = "Start Timer";
    } else {
        timer = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                isTimerRunning = false;
                startButton.disabled = true;
                timerButton.textContent = "Start Timer";
            }
        }, 1000);
        isTimerRunning = true;
        timerButton.textContent = "Stop Timer";
        startButton.disabled = false; // タイマー開始でスタートボタンを有効にする
    }
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    timeRemaining = 5 * 60;
    updateTimerDisplay();
    startButton.disabled = true;
    timerButton.textContent = "Start Timer";
}

stopButtons.forEach((button, index) => {
    button.addEventListener("click", () => stopSlot(index));
});

startButton.addEventListener("click", startSpin);
timerButton.addEventListener("click", toggleTimer);
resetTimerButton.addEventListener("click", resetTimer);

initializeSlots();
updateTimerDisplay();
