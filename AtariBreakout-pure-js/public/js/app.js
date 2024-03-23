import Brain from "./brain.js";
import UI from "./ui.js";

// recursively update UI
function uiDrawRepeater(ui) {
    setTimeout(() => {
        ui.draw();
        uiDrawRepeater(ui);
    }, 0);
}

function main() {
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    ui.drawLandingPage();

    // Event listener for the play button
    document.addEventListener('click', () => {
        const nickname = document.getElementById('nickname').value.trim();
        if (nickname) {
            //
            brain.startGame(nickname);
            ui.hideLandingPage();

            // Update UI
            uiDrawRepeater(ui);
        } else {
            alert('Please enter a nickname to continue.');
        }
    });

    document.addEventListener('keydown', (e) => {
        // console.log(e);
        switch (e.key) {
            case 'ArrowLeft':
                brain.startMovePaddle(-1);
                break;
            case 'ArrowRight':
                brain.startMovePaddle(1);
                break;
        }
    });
    document.addEventListener('keyup', (e) => {
        // console.log(e);
        switch (e.key) {
            case 'ArrowLeft':
                brain.stopMovePaddle();
                break;
            case 'ArrowRight':
                brain.stopMovePaddle();
                break;
        }
    });


    document.addEventListener('keypress', (e) => {
        // console.log(e);
        if (e.code === "Space") {
            // Either ball-down boarder collision or the game has been finished.
            if (brain.gameOver || brain.gameIsFinished) {
                brain.resetGame();
            }
            else if (!brain.gamePaused) {
                brain.gamePaused = true;
                brain.stop();
            }
            else if (brain.gamePaused) {
                brain.gamePaused = false;
                brain.play();
            }
        }
    });
}

// ============== ENTRY POINT ==============
console.log("App setup...")
main()