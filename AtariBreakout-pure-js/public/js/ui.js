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

        divBall.style.left = this.calculatedScaledX(ball.left) + 'px';
        divBall.style.top = this.calculatedScaledY(ball.top) + 'px';

        divBall.style.width = this.calculatedScaledX(ball.width) + 'px';
        divBall.style.height = this.calculatedScaledY(ball.height) + 'px';
        divBall.style.backgroundColor = ball.color;

        this.appContainer.append(divBall);
    }

    // drawBlock(brain) {
    //     let divBlock = document.createElement('div');
    //
    //     divBlock.style.zIndex = 10;
    //     divBlock.style.position = 'fixed';
    //
    //     // brain.left - brain.borderThickness - brain.blo
    //     divBlock.style.left = this.calculatedScaledX(brain.block.left) + 'px';
    //     divBlock.style.top = this.calculatedScaledY(brain.block.top) + 'px';
    //
    //     divBlock.style.width = this.calculatedScaledX(brain.block.width) + 'px';
    //     divBlock.style.height = this.calculatedScaledY(brain.block.height) + 'px';
    //     divBlock.style.backgroundColor = brain.block.color;
    //
    //     this.appContainer.appendChild(divBlock);
    // }

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
            } else {
                // this.appContainer.removeChild(block);
                //TODO: should delete div
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

        divPause.style.left =  this.calculatedScaledX(this.brain.width/2 - 86) + 'px';
        divPause.style.top =  this.calculatedScaledY((this.brain.borderThickness + 10)) + 'px';

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

        divScore.style.left =  this.calculatedScaledX(this.brain.borderThickness + 25) + 'px';
        divScore.style.top =  this.calculatedScaledY((this.brain.borderThickness + 10)) + 'px';

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

        divLevel.style.left =  this.calculatedScaledX(this.brain.width - (this.brain.borderThickness + 50)) + 'px';
        divLevel.style.top =  this.calculatedScaledY((this.brain.borderThickness + 10)) + 'px';

        divLevel.style.color = "skyblue";

        this.appContainer.append(divLevel);
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
        if (this.brain.gamePaused) {
            this.drawPause();
        }
        this.drawScore();
        this.drawLevel();
    }
}