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
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.left = this.calculatedScaledX(paddle.left) + 'px';
        div.style.top = this.calculatedScaledY(paddle.top) + 'px';

        div.style.width = this.calculatedScaledX(paddle.width) + 'px';
        div.style.height = this.calculatedScaledY(paddle.height) + 'px';
        div.style.backgroundColor = paddle.color;

        this.appContainer.append(div);
    }

    draw() {
        // clear previous render
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        this.drawPaddle(this.brain.paddle);
    }
}