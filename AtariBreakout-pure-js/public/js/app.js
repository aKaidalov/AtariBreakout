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

    document.addEventListener('keydown', (e) => {
        console.log(e);
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
        console.log(e);
        switch (e.key) {
            case 'ArrowLeft':
                brain.stopMovePaddle();
                break;
            case 'ArrowRight':
                brain.stopMovePaddle();
                break;
        }
    });

    // TODO: can put this along with Arrow buttons
    document.addEventListener('keypress', (e) => {
        console.log(e);
        if (e.code === "Space") {
            if (!brain.gamePaused) {
                brain.gamePaused = true;
                brain.stopMoveBall();
            }
            else if (brain.gamePaused) {
                brain.gamePaused = false;
                brain.startMoveBall();
            }
        }
    });



    uiDrawRepeater(ui);
}

// ============== ENTRY POINT ==============
console.log("App setup...")
main()