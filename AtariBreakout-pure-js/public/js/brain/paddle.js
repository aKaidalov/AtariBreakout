export default class Paddle {
    width = 200;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    velocityX = 5;
    color = 'orange';
    #intervalId = null;

    brain = null;

    constructor(brain) {
        this.brain = brain

        // create element with adaptive size
        this.left = (brain.width/2) - (this.width/2);
        this.top = brain.height - this.height - brain.borderThickness;
    }

    validateAndFixPosition() {
        if (this.left < this.brain.borderThickness) {
            this.left = this.brain.borderThickness;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
        if (this.left + this.width + this.brain.borderThickness > 1000) {
            this.left = 1000 - (this.width + this.brain.borderThickness);
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    startMove(step) {
        this.validateAndFixPosition();
        if (!this.#intervalId) {    // == null
            this.#intervalId = setInterval(() => {
                // if step is negative move left, otherwise right
                this.left += step * this.velocityX;
                this.validateAndFixPosition();
            }, 10);
        }
    }

    stopMove() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
            this.validateAndFixPosition();
        }
    }
}
