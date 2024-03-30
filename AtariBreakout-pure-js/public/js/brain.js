export class Paddle {
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

export class Ball {
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

export class Block {
    constructor(left, top, width, height, color) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.color = color;
        this.break = false; // Assuming 'break' is a state property for each block
        this.div = null; // New property to hold the div reference
    }
}

export class Blocks {
    blockArr = [];

    blockWidth = 122;
    blockHeight = 30;
    blockLeft = 0;   // x
    blockTop = 0;    // y
    blockColor = 'skyblue';

    columns = 7;
    rows = 1; // Add more as game goes on. Also rows === level of the game
    maxRows = 5; // Limit how many rows
    gap = 10;
    count = 0;

    constructor(brain) {
        this.blockLeft = brain.borderThickness + 25;
        this.blockTop = brain.borderThickness + 120;

        this.createBlocks();
    }

    createBlocks() {
        this.blockArr = [];
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows; r++) {
                let block = new Block(
                    this.blockLeft + (this.blockWidth + this.gap) * c,
                    this.blockTop + (this.blockHeight + this.gap) * r,
                    this.blockWidth,
                    this.blockHeight,
                    this.blockColor
                );
                this.blockArr.push(block);
            }
        }
        this.count = this.blockArr.length; // Update the count after creating blocks
    }

    updateBlocks() {
        let tempBlockArr = this.blockArr.filter(block => !block.break);

        // Clear the existing block array
        this.blockArr = [...tempBlockArr];

        // Update the count to reflect current non-broken blocks
        this.count = this.blockArr.length;
    }
}

export class Player {
    username = 'default user';
    score = 0;

    constructor(username) {
        this.username = username;
    }

    updateScore(newScore) {
        if (this.score < newScore) {
            this.score = newScore;
        }
    }

}

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 20;

    #intervalId = null;

    players = [];
    currentPlayer = null;

    gameStarted = false; // Is used to decide if the landing page must be shown or not
    gamePaused = false;
    score = 0;
    gameOver = false;
    gameIsFinished = false;

    paddle = new Paddle(this);
    ball = new Ball(this);
    blocks = new Blocks(this);


    // PADDLE ACTIONS
    startMovePaddle(step) {
        if (!this.gamePaused && !this.gameOver && !this.gameIsFinished) {
            this.paddle.startMove(step);
        }
    }
    stopMovePaddle() {
        this.paddle.stopMove();
    }

    // GAME ACTIONS
    startGame(username) {
        this.resetGame();

        // Convert to upper because ArcadeClassic font has only upper letters
        console.log('Starting game for:', username.toUpperCase()); // Debugging

        // Find existing player or create a new one
        this.createCurrentPlayer(username);

        this.play();
    }

    createCurrentPlayer(username) {
        // While main font is ArcadeClassic there should be .toUpperCase()
        let existingPlayer = this.players.find(player => player.username.toUpperCase() === username.toUpperCase());

        if (existingPlayer) {
            this.currentPlayer = existingPlayer;
        }
        else {
            this.currentPlayer = new Player(username);
            this.players.push(this.currentPlayer);
        }
    }

    play() {
        // Updates all actions.
        if (!this.#intervalId) {    // == null
            this.#intervalId = setInterval(() => {
                if (this.gameOver || this.gameIsFinished) {
                    this.stop();
                }

                this.ball.move();

                this.bounceBallOffWalls();
                this.bounceOffPaddle();
                this.bounceOffBlocks();

                // Don't show broken blocks
                this.blocks.updateBlocks();

                // Manage game actions
                if (this.blocks.count === 0) {
                    // Finish the game if last block was hit
                    if (this.blocks.rows === this.blocks.maxRows) {
                        this.gameIsFinished = true;
                        // this.gameOver = true;
                    } else {
                        this.nextLevel();
                    }
                }
            }, 10);
        }
    }

    stop() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;

            this.currentPlayer.updateScore(this.score);

            this.filterBestPlayers();
        }
    }

    // To help display on the landing page
    // specific amount of players.
    filterBestPlayers() {
        // Keep and sort best players
        const playersToDisplay = 5;
        this.players.sort((a, b) => b.score - a.score).splice(playersToDisplay);
    }


    //level = blockRows
    nextLevel() {
        // Return ball and paddle to start position and make the ball slightly faster.
        this.resetBall(Math.abs(this.ball.velocityX) + 1, Math.abs(this.ball.velocityY) + 1);
        this.resetPaddle()

        this.score += 100*this.blocks.rows*this.blocks.columns; //bonus points
        this.blocks.rows = Math.min(this.blocks.rows + 1, this.blocks.maxRows);
        this.blocks.createBlocks();
    }

    resetGame() {
        this.stop()

        // Reset game elements
        this.resetPaddle();
        this.resetBall(3, 2);
        this.resetBlocks();

        // Reset game state
        this.gameStarted = true; // shows that ui should be recursively updated to display the game
        this.gamePaused = false;
        this.gameOver = false;
        this.gameIsFinished = false;
        this.score = 0;

        this.play();
    }

    resetPaddle() {
        this.paddle.left = (this.width / 2) - (this.paddle.width / 2);
        this.paddle.top = this.height - this.paddle.height - this.borderThickness;
        this.paddle.stopMove();
    }

    resetBall(vx, vy) {
        this.ball.left = (this.width / 2) - (this.ball.width / 2);
        this.ball.top = (this.height / 2) - (this.ball.height / 2);
        this.ball.velocityX = vx; // Reset to original velocity if changed during gameplay
        this.ball.velocityY = vy; // Reset to original velocity if changed during gameplay
    }

    resetBlocks() {
        this.blocks.rows = 1; // Start with initial number of rows
        this.blocks.createBlocks(); // Re-create the blocks for the new game
    }


    // COLLISION TODO: it has a bug when detects corner collision! - Logic problem.
    detectCollision(a, b) {
        return  a.left <= b.left + b.width &&  // a's top left corner doens't reach b's top right corner
            a.left + a.width >= b.left &&  // a's top right corner doesn't reach b's top left corner
            a.top <= b.top + b.height && // a's top left corner doesn't reach b's bottom left corner
            a.top + a.height >= b.top;   // a's bottom left corner passes b's top left corner
    }


    // Border collision
    bounceBallOffWalls() {
        if (this.ball.top - this.borderThickness <= 0) {
            //if ball touches top of the board
            this.ball.changeDirectionY();
        }
        else if (this.ball.left - this.borderThickness <= 0 ||
            (this.ball.left + this.ball.width) >= (this.width - this.borderThickness)) {
            //if ball touches left/right (with top left corner or top right corner)
            this.ball.changeDirectionX();
        }
        else if (this.ball.top + this.ball.height >= this.height) {
            //if ball touches bottom side
            this.gameOver = true;
        }

        //game is FINALLY finished!
        if (this.blocks.rows === this.blocks.maxRows && this.blocks.count === 0) {
            this.gameIsFinished = true;
        }
    }

    // Paddle collision
    bounceOffPaddle() {
        if (this.detectCollision(this.ball, this.paddle)) {
            this.ball.changeDirectionY();
        }
    }

    // Block collision
    bounceOffBlocks() {
        this.blocks.blockArr.forEach(block => {
            if (this.detectCollision(this.ball, block)) {
                block.break = true;
                this.ball.changeDirectionY();
                this.blocks.count--;
                this.score += 100;
            }
        });

    }
}