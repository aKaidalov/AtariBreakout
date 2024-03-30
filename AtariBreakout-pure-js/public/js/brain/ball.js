export default class Ball {
    width = 35;
    height = 35;
    left = 0;   // x
    top = 0;    // y
    velocityX = 3;
    velocityY = 2;
    color = 'white';

    constructor(brain) {
        this.left = (brain.width/2) - (this.width/2);
        this.top = (brain.height/2) - (this.height/2);
    }

    // Move
    move() {
        this.left += this.velocityX;
        this.top += this.velocityY;
    }

    changeDirectionX() {
        this.velocityX *= -1;   // reverse X direction
    }
    changeDirectionY() {
        this.velocityY *= -1;   // reverse Y direction
    }
}