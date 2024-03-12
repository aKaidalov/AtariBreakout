import Brain from "./brain.js";
import UI from "./ui.js";

function main() {
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    ui.draw();

    window.addEventListener('resize', (e) => {
        ui.draw();
    });

    document.addEventListener('keydown', (e) => {
        console.log(e);
        switch (e.key) {
            case 'ArrowLeft':
                brain.movePaddle(-1);
                break;
            case 'ArrowRight':
                brain.movePaddle(1);
                break;
        }
        ui.draw();
    });
}

// ============== ENTRY POINT ==============
console.log("App setup...")
main()