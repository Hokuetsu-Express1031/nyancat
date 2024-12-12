function checkScore() {
    // スロットの正確な位置にある画像を取得
    const secondRowValues = [
        orderArray[0][positions[0] % orderArray[0].length],
        orderArray[1][positions[1] % orderArray[1].length],
        orderArray[2][positions[2] % orderArray[2].length]
    ];

    const scoreMap = {
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 30,
        6: 40,
        7: 100,
        8: 300
    };

    if (secondRowValues[0] === secondRowValues[1] && secondRowValues[1] === secondRowValues[2]) {
        const matchedValue = secondRowValues[0];
        
        if (scoreMap[matchedValue]) {
            score += scoreMap[matchedValue];
            alert(`Congratulations! You've won ${scoreMap[matchedValue]} coins!`);
        }
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
