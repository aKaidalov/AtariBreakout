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

    /*ui.draw();

    const fn = (e) => {
        ui.draw();
    }

    window.addEventListener('resize', fn);*/

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

    // document.addEventListener('keydown', (e) => {
    //     console.log(e);
    //     switch (e.key) {
    //         case 'ArrowLeft':
    //             brain.movePaddle(-1);
    //             break;
    //         case 'ArrowRight':
    //             brain.movePaddle(1);
    //             break;
    //     }
    //     ui.draw();
    // });

    // draw ui as fast as possible - on repeat
    uiDrawRepeater(ui);
}

// ============== ENTRY POINT ==============
console.log("App setup...")
main()