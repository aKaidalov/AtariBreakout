export default class Ball {
    width = 35;
    height = 35;
    left = 0;   // x
    top = 0;    // y
    speed = 5;
    velocityX = 3;
    velocityY = 0; // resetBall();
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

    bounce(paddle) {
        let collidePoint = this.left - (paddle.left + paddle.width/2);
        collidePoint /= (paddle.width/2);
        let angle = collidePoint * (Math.PI/3);
        this.velocityX = this.speed * Math.sin(angle);
        this.velocityY = - this.speed * Math.cos(angle);
    }
}