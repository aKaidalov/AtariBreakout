export default class UI {
    // real screen dimensions
    width = -1;
    height = -1;

    brain = null;
    appContainer = null;

    scaleX = 1;
    scaleY = 1;

    constructor(brain, appContainer) {
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions();

        console.log(this);
    }

    setScreenDimensions(width, height) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    calculatedScaledX(x) {
        return x * this.scaleX | 0; // (bitwise operator) converts an integer to a number
    }
    calculatedScaledY(y) {
        return y * this.scaleY | 0;
    }

    drawBorderSingle(left, top, width, height, color) {
        let border = document.createElement('div');

        border.style.zIndex = 10;
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawBorder() {
        // top
        this.drawBorderSingle(0, 0, this.width, this.calculatedScaledY(this.brain.borderThickness), 'skyblue');
        // left
        this.drawBorderSingle(0, 0, this.calculatedScaledX(this.brain.borderThickness), this.height, 'skyblue');
        // right
        this.drawBorderSingle(this.width - this.calculatedScaledX(this.brain.borderThickness), 0, this.calculatedScaledX(this.brain.borderThickness), this.height, 'skyblue');
    }

    drawPaddle(paddle) {
        let divPaddle = document.createElement('div');

        divPaddle.style.zIndex = 10;
        divPaddle.style.position = 'fixed';

        divPaddle.style.left = this.calculatedScaledX(paddle.left) + 'px';
        divPaddle.style.top = this.calculatedScaledY(paddle.top) + 'px';

        divPaddle.style.width = this.calculatedScaledX(paddle.width) + 'px';
        divPaddle.style.height = this.calculatedScaledY(paddle.height) + 'px';
        divPaddle.style.backgroundColor = paddle.color;

        this.appContainer.append(divPaddle);
    }

    drawBall(ball) {
        let divBall = document.createElement('div');

        divBall.style.zIndex = 10;
        divBall.style.position = 'fixed';
        divBall.style.borderRadius = "50%";
        divBall.style.backgroundColor = ball.color;

        // Assuming calculatedScaledX and calculatedScaledY return scale factors
        // You need a uniform scale factor for both dimensions
        let scaleFactor = Math.min(this.calculatedScaledX(ball.width), this.calculatedScaledY(ball.height));

        divBall.style.width = scaleFactor + 'px';
        divBall.style.height = scaleFactor + 'px';

        // Use the original position calculations, assuming they're based on the container's dimensions
        divBall.style.left = this.calculatedScaledX(ball.left) + 'px';
        divBall.style.top = this.calculatedScaledY(ball.top) + 'px';

        this.appContainer.append(divBall);
    }

    drawBlocks(brain) {
        brain.blocks.blockArr.forEach(block => {
            if (!block.break) { // Draw only if the block wasn't break

                let divBlock = document.createElement('div');

                divBlock.style.zIndex = 10;
                divBlock.style.position = 'fixed';

                divBlock.style.left = this.calculatedScaledX(block.left) + 'px';
                divBlock.style.top = this.calculatedScaledY(block.top) + 'px';

                divBlock.style.width = this.calculatedScaledX(block.width) + 'px';
                divBlock.style.height = this.calculatedScaledY(block.height) + 'px';
                divBlock.style.backgroundColor = block.color;

                this.appContainer.appendChild(divBlock);
            }
        });
    }

    drawPause() {
        let divPause = document.createElement('div');

        divPause.style.zIndex = 10;
        divPause.style.position = 'fixed';
        divPause.style.textAlign = 'center';

        divPause.textContent = "PAUSE";
        divPause.style.fontSize = "5vw";
        divPause.style.fontFamily = "'Arial', sans-serif";

        divPause.style.left = "50%";
        divPause.style.top = "8%";
        divPause.style.transform = "translate(-50%, -50%)";

        divPause.style.color = "white";

        this.appContainer.append(divPause);
    }

    drawScore() {
        let divScore = document.createElement('div');

        divScore.style.zIndex = 10;
        divScore.style.position = 'fixed';

        divScore.textContent = `${this.brain.score}`;
        divScore.style.fontSize = "5vw";
        divScore.style.fontFamily = "'Arial', sans-serif";

        divScore.style.left = "4.4%";
        divScore.style.top = "8%";
        divScore.style.transform = "translate(0%, -50%)";

        divScore.style.color = "orange";

        this.appContainer.append(divScore);
    }

    drawLevel() {
        let divLevel = document.createElement('div');

        divLevel.style.zIndex = 10;
        divLevel.style.position = 'fixed';

        divLevel.textContent = `${this.brain.blocks.rows}`;
        divLevel.style.fontSize = "5vw";
        divLevel.style.fontFamily = "'Arial', sans-serif";
        divLevel.style.textAlign = 'right';

        divLevel.style.right = "3.9%";
        divLevel.style.top = "8%";
        divLevel.style.transform = "translate(0%, -50%)";

        divLevel.style.color = "skyblue";

        this.appContainer.append(divLevel);
    }

    drawGameOver() {
        // Create the GAME OVER div
        let divGameOver = document.createElement('div');

        divGameOver.style.zIndex = 10;
        divGameOver.style.position = 'fixed';

        divGameOver.textContent = "GAME OVER";
        divGameOver.style.fontSize = "10vw";
        divGameOver.style.fontFamily = "'Arial', sans-serif";

        divGameOver.style.whiteSpace = "nowrap";
        divGameOver.style.left = "50%";
        divGameOver.style.top = "50%";
        divGameOver.style.transform = "translate(-50%, -50%)";

        divGameOver.style.color = "white";

        this.appContainer.append(divGameOver);

        // Create the restart message div
        this.drawSubtitle()

    }

    drawCelebration() {
        let divCelebration = document.createElement('div');

        divCelebration.style.zIndex = 10;
        divCelebration.style.position = 'fixed';

        divCelebration.textContent = "YOU WON!";
        divCelebration.style.fontSize = "12vw";
        divCelebration.style.fontFamily = "'Arial', sans-serif";

        divCelebration.style.whiteSpace = "nowrap";
        divCelebration.style.left = "50%";
        divCelebration.style.top = "50%";
        divCelebration.style.transform = "translate(-50%, -50%)";

        divCelebration.style.color = "orange";

        this.appContainer.append(divCelebration);

        // Create the restart message div
        this.drawSubtitle();
    }

    drawSubtitle() {
        let divRestartMessage = document.createElement('div');

        divRestartMessage.style.zIndex = 10;
        divRestartMessage.style.position = 'fixed';

        divRestartMessage.textContent = "Press 'Space' to restart";
        divRestartMessage.style.fontSize = "4vw"; // Smaller font size
        divRestartMessage.style.fontFamily = "'Arial', sans-serif";

        divRestartMessage.style.whiteSpace = "nowrap";
        divRestartMessage.style.left = "50%";
        // Position below the GAME OVER div by adjusting the top value
        divRestartMessage.style.top = "calc(50% + 7vw)"; // Adjust the 10vw to change the distance below GAME OVER
        divRestartMessage.style.transform = "translate(-50%, 0)"; // Only horizontally centering

        divRestartMessage.style.color = "skyblue";

        this.appContainer.append(divRestartMessage);
    }

    clearAppContainer() {
        while (this.appContainer.firstChild) {
            this.appContainer.removeChild(this.appContainer.firstChild);
        }
    }

    draw() {
        // clear previous render
        // this.appContainer.innerHTML = '';
        this.clearAppContainer()
        this.setScreenDimensions();

        // Game elements
        this.drawBorder();
        this.drawPaddle(this.brain.paddle); // TODO: Can replace with this.brain and execute this.brain.paddle inside.
        this.drawBall(this.brain.ball);
        this.drawBlocks(this.brain);

        // Info
        this.drawScore();
        this.drawLevel();

        if (this.brain.gamePaused) {
            this.drawPause();
        }
        if (this.brain.gameOver && !this.brain.gameIsFinished) {
            this.drawGameOver();
        }
        if (this.brain.gameIsFinished) {
            this.drawCelebration();
        }
    }
}