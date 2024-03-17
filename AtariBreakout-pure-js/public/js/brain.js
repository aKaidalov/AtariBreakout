export class Paddle {
    width = 200;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    velocityX = 20;
    color = 'orange'; // TODO: add a class name when create div to change in css
    #intervalId = null; //TODO: how does it help???

    constructor(brain) {
        // create element with adaptive size
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
    width = 30;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    velocityX = 3;
    velocityY = 2;
    color = 'white';
    #intervalId = null;

    constructor(brain) {
        this.left = (brain.width/2) - (this.width/2);
        this.top = (brain.height/2) - (this.height/2);

        this.startMove(brain);
    }

    // Move
    startMove(brain) {
        // this.validateAndFixPosition(borderThickness);
        if (!this.#intervalId) {    // == null
            this.#intervalId = setInterval(() => {
                this.left += this.velocityX;
                this.top += this.velocityY;

                this.bounceBallOffWalls(brain);
                this.bounceOffPlayer(brain);
                this.bounceOffBlocks(brain);
            }, 10);
        }
    }

    stopMove() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
            // this.validateAndFixPosition(borderThickness);
        }
    }

    // Border collision
    bounceBallOffWalls(brain) {
        if (this.top - brain.borderThickness <= 0) { // || (ball.y + ball.height) >= boardHeight
            //if ball touches top of the board
            this.velocityY *= -1; //reverse direction
        }
        else if (this.left - brain.borderThickness <= 0 ||
            (this.left + this.width) >= (brain.width - brain.borderThickness)) {
            //if ball touches left/right (with top left corner or top right corner)
            this.velocityX *= -1;
        }
        else if (this.top + this.height >= brain.height) {
            this.velocityY *= -1;

        }

    }

    // Player collision
    bounceOffPlayer(brain) {
        if (brain.topCollision(this, brain.paddle) || brain.bottomCollision(this, brain.paddle)) {
            this.velocityY *= -1; //flip Y direction up/down
        }
        else if (brain.leftCollision(this, brain.paddle) || brain.rightCollision(this, brain.paddle)) {
            this.velocityX *= -1; //flip X direction left/right
        }
    }

    // Block collision
    bounceOffBlocks(brain) {
        brain.blocks.blockArr.forEach(block => {
            console.log('POPA')
            if (brain.topCollision(this, block) || brain.bottomCollision(this, block)) {
                block.break = true;
                this.velocityY *= -1;
                brain.blocks.count--;
                // score += 100;
            }
            else if (brain.leftCollision(this, block) || brain.rightCollision(this, block)) {
                block.break = true;
                this.velocityX *= -1;
                brain.blocks.count--;
                // score += 100;
            }
        });

    }
}

export class Block {
    constructor(left, top, width, height, color) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.color = color;
        this.break = false; // Assuming 'break' is a state property for each block
    }
}

export class Blocks {
    blockArr = [];

    width = 122;
    height = 30;
    left = 0;   // x
    top = 0;    // y
    color = 'skyblue';

    columns = 7;
    rows = 5; //add more as game goes on
    maxRows = 10; //limit how many rows
    gap = 10;
    count = 0;

    constructor(brain) {
        this.left = brain.borderThickness + 25;
        this.top = brain.borderThickness + 90;

        // TODO: may be the problem occures because i create blocks once in the constr.
        //  Should be updated dynamically.
        this.createBlocks();
    }

    createBlocks() {
        this.blockArr = [];
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows; r++) {
                let block = new Block(
                    this.left + (this.width + this.gap) * c,
                    this.top + (this.height + this.gap) * r,
                    this.width,
                    this.height,
                    this.color
                );
                this.blockArr.push(block);
            }
        }
        this.count = this.blockArr.length; // Update the count after creating blocks
    }

}

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 20;
    gamePaused = false;

    paddle = new Paddle(this);
    ball = new Ball(this);
    blocks = new Blocks(this);


    // PADDLE ACTIONS
    startMovePaddle(step) {
        if (!this.gamePaused){
            this.paddle.startMove(step, this.borderThickness);
        }
    }
    stopMovePaddle() {
        this.paddle.stopMove(this.borderThickness);
    }

    // BALL ACTIONS
    startMoveBall() {
        this.ball.startMove(this);
    }
    stopMoveBall() {
        this.ball.stopMove();
    }

    // BLOCK ACTIONS



    // COLLISION TODO: it has a bug when detects corner collision! - Logic problem.
    detectCollision(a, b) {
        return  a.left < b.left + b.width &&  // a's top left corner doens't reach b's top right corner
            a.left + a.width > b.left &&  // a's top right corner doesn't reach b's top left corner
            a.top < b.top + b.height && // a's top left corner doesn't reach b's bottom left corner
            a.top + a.height > b.top;   // a's bottom left corner passes b's top left corner
    }

    topCollision(ball, block) { // a is above b (ball is above block)
        return this.detectCollision(ball, block) && (ball.top + ball.height) >= block.top;
    }

    bottomCollision(ball, block) { // a is bellow b (ball is bellow block)
        return this.detectCollision(ball, block) && (block.top + block.height) >= ball.top;
    }

    leftCollision(ball, block) { // a is left of b (ball is left of block)
        return this.detectCollision(ball, block) && (ball.left + ball.width) >= block.left;
    }

    rightCollision(ball, block) { // a is right of b (ball is left of block)
        return this.detectCollision(ball, block) && (block.left + block.width) >= ball.left;
    }
}