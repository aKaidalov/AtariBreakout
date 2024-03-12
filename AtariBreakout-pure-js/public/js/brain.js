export class Paddle {
    width = 200;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    velocityX = 30;

    color = 'orange'; // TODO: add a class name when create div and change in css

    constructor(brain) {
        this.left = (brain.width/2) - (this.width/2);
        this.top = brain.height - this.height - brain.borderThickness;
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

    movePaddle(step) {
        // if step is negative move left, otherwise right
        this.paddle.left += step * this.paddle.velocityX;
    }
}