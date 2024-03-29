import Brain from "./brain.js";
import UI from "./ui.js";

// recursively update UI
function uiDrawRepeater(ui, brain) {
    setTimeout(() => {
        if (brain.gameStarted) {
            ui.draw();
            uiDrawRepeater(ui, brain);
        }
    }, 0);
}

function setupPlayButton(brain, ui) {
    const playButton = document.getElementById('play-button');
    const usernameInput = document.getElementById('username');

    // Function to handle play action
    const playAction = () => {
        const username = usernameInput.value.trim();
        if (username) {
            brain.startGame(username);
            ui.hideLandingPage();
            uiDrawRepeater(ui, brain);
        } else {
            alert('Please enter a username to continue.');
        }
    };

    // Attach click event listener to the play button
    if (playButton) {
        playButton.addEventListener('click', playAction);
    }

    // Attach keypress event listener to the username input
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                playAction();
            }
        });
    }
}

function main() {
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    // Enter username
    ui.drawLandingPage();
    setupPlayButton(brain, ui); // Set up the play button initially


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
        if (e.code === 'Space') {
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
        } else if (e.code === 'KeyE') {
            if (brain.gameOver || brain.gameIsFinished) {
                brain.gameStarted = false;
                ui.drawLandingPage();
                setupPlayButton(brain, ui);
            }
        }
    });
}

// ============== ENTRY POINT ==============
console.log("App setup...")
main()