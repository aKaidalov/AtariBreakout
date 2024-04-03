import Paddle from "./paddle.js";
import Ball from "./ball.js";
import BlockContainer from "./blockContainer.js";
import Player from "./player.js";

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
    blocks = new BlockContainer(this);


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
                this.blocks.updateBlockContainer();

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
        this.resetBall(this.ball.speed + 1);
        this.resetPaddle()

        this.score += 100*this.blocks.rows*this.blocks.columns; //bonus points
        this.blocks.rows = Math.min(this.blocks.rows + 1, this.blocks.maxRows);
        this.blocks.createBlockContainer();
    }

    resetGame() {
        this.stop()

        // Reset game elements
        this.resetPaddle();
        this.resetBall(5);
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

    resetBall(speed) {
        this.ball.left = (this.width / 2) - (this.ball.width / 2);
        this.ball.top = this.paddle.top - this.ball.height;
        // this.ball.velocityX = vx;
        this.ball.velocityY = - speed;
        this.ball.speed = speed;
    }

    resetBlocks() {
        this.blocks.rows = 1; // Start with initial number of rows
        this.blocks.createBlockContainer(); // Re-create the blocks for the new game
    }


    // COLLISION
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
            // this.ball.changeDirectionY();
            this.ball.bounce(this.paddle);
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