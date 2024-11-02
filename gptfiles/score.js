// score.js

function checkScore() {
    const secondRowValues = [positions[0], positions[1], positions[2]];
    if (secondRowValues[0] === secondRowValues[1] && secondRowValues[1] === secondRowValues[2]) {
        score += 2; // スコアを2倍にする
        alert("Congratulations!");
    }
    scoreDisplay.innerText = "保有コイン数: " + score;
}



// popup.js

document.addEventListener("DOMContentLoaded", () => {
    const helpButton = document.getElementById("help-button");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("close-popup");

    // 要素が取得できたか確認
    console.log(helpButton, popup, closePopup);

    if (helpButton && popup && closePopup) {
        helpButton.addEventListener("click", () => {
            popup.style.display = "flex"; // ポップアップを表示
        });

        closePopup.addEventListener("click", () => {
            popup.style.display = "none"; // ポップアップを非表示
        });

        window.addEventListener("click", (event) => {
            if (event.target === popup) {
                popup.style.display = "none"; // ポップアップを非表示
            }
        });
    } else {
        console.error("One or more elements were not found in the DOM.");
    }
});
