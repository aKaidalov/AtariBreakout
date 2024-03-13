export class Paddle {
    width = 200;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    velocityX = 20;
    color = 'orange'; // TODO: add a class name when create div to change in css
    #intervalId = null; //TODO: how does it help???

    constructor(brain) {
        this.left = (brain.width/2) - (this.width/2);
        this.top = brain.height - this.height - brain.borderThickness;
    }

    validateAndFixPosition(borderThickness) {
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
        if (this.left + this.width + borderThickness > 1000) {
            this.left = 1000 - (this.width + borderThickness);
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    startMove(step, borderThickness) {
        this.validateAndFixPosition(borderThickness);

        if (!this.#intervalId) {    // == null

            // this.left += step * this.velocityX;
            // this.validateAndFixPosition(borderThickness);

            this.#intervalId = setInterval(() => {
                // if step is negative move left, otherwise right
                this.left += step * this.velocityX;
                this.validateAndFixPosition(borderThickness);   //TODO: why does he repeats this to lines?
            }, 40);
        }
    }

    stopMove(borderThickness) {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);    //TODO: what happens here?
            this.#intervalId = null;
            this.validateAndFixPosition(borderThickness);
        }
    }
}

export class Ball {

}

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 20;

    // create paddle with adaptive size
    paddle = new Paddle(this);

    constructor() {
        console.log("Brain constr");
    }

    // movePaddle(step) {
    //     // if step is negative move left, otherwise right
    //     this.paddle.left += step * this.paddle.velocityX;
    // }
    startMovePaddle(step) {
        this.paddle.startMove(step, this.borderThickness);
    }
    stopMovePaddle() {
        this.paddle.stopMove(this.borderThickness);
    }
}