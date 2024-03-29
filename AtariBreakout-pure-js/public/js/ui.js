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


    // GAME ELEMENTS
    drawBorderSingle(left, top, width, height, color) {
        let border = document.createElement('div');

        border.style.zIndex = '10';
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

        divPaddle.style.zIndex = '10';
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

        divBall.style.zIndex = '10';
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

                divBlock.style.zIndex = '10';
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


    // INFO
    drawPause() {
        let divPause = document.createElement('div');

        divPause.style.zIndex = '10';
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

        divScore.style.zIndex = '10';
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

        divLevel.style.zIndex = '10';
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
        // Flex container for game over and messages
        let divFlexContainer = this.createFlexContainer();

        // Game Over element
        let divGameOver = document.createElement('div');
        divGameOver.textContent = "GAME OVER";
        divGameOver.style.fontSize = "10vw";
        divGameOver.style.fontFamily = "'Arial', sans-serif";
        divGameOver.style.color = "white";

        // Append Game Over element to flex container
        divFlexContainer.appendChild(divGameOver);

        // Create and append restart and exit messages to flex container
        let divRestartMessage = this.createInfoMessage("Press 'Space' to restart", "skyblue", "4vw");
        let divExitMessage = this.createInfoMessage("Press 'E' to exit", "grey", "4vw");
        divFlexContainer.appendChild(divRestartMessage);
        divFlexContainer.appendChild(divExitMessage);

        // Append the flex container to the app container
        this.appContainer.appendChild(divFlexContainer);
    }
    drawCelebration() {
        // Flex container for game over and messages
        let divFlexContainer = this.createFlexContainer();

        // Game Over element
        let divGameOver = document.createElement('div');
        divGameOver.textContent = "YOU WON!";
        divGameOver.style.fontSize = "12vw";
        divGameOver.style.fontFamily = "'Arial', sans-serif";
        divGameOver.style.color = "orange";

        // Append Game Over element to flex container
        divFlexContainer.appendChild(divGameOver);

        // Create and append restart and exit messages to flex container
        let divRestartMessage = this.createInfoMessage("Press 'Space' to restart", "skyblue", "4vw");
        let divExitMessage = this.createInfoMessage("Press 'E' to exit", "grey", "4vw");
        divFlexContainer.appendChild(divRestartMessage);
        divFlexContainer.appendChild(divExitMessage);

        // Append the flex container to the app container
        this.appContainer.appendChild(divFlexContainer);
    }

    createFlexContainer() {
        let divFlexContainer = document.createElement('div');
        divFlexContainer.style.display = 'flex';
        divFlexContainer.style.flexDirection = 'column';
        divFlexContainer.style.alignItems = 'left';
        divFlexContainer.style.justifyContent = 'center';
        divFlexContainer.style.position = 'fixed';
        divFlexContainer.style.left = '50%';
        divFlexContainer.style.top = '50%';
        divFlexContainer.style.transform = 'translate(-50%, -50%)';
        divFlexContainer.style.zIndex = '10';
        divFlexContainer.style.whiteSpace = "nowrap";
        return divFlexContainer;
    }

    // Helper function to create info message divs
    createInfoMessage(textContent, color, fontSize) {
        let divMessage = document.createElement('div');
        divMessage.textContent = textContent;
        divMessage.style.fontSize = fontSize;
        divMessage.style.fontFamily = "'Arial', sans-serif";
        divMessage.style.color = color;
        return divMessage;
    }


    // LANDING PAGE
    drawLandingPage() {
        this.clearAppContainer()
        this.setScreenDimensions();

        this.createLandingPage();
    }

    createLandingPage() {
        const landingPage = document.createElement('div');

        landingPage.id = 'landing-page';
        landingPage.style.zIndex = '10';
        landingPage.style.position = 'fixed';
        landingPage.style.left = '50%';
        landingPage.style.top = '35%';
        landingPage.style.transform = 'translate(-50%, -50%)';
        landingPage.style.textAlign = 'center';
        landingPage.style.fontFamily = "'Arial', sans-serif";

        this.drawWelcomeMessage(landingPage);
        this.drawUsernameInput(landingPage);
        this.drawPlayButton(landingPage);
        this.drawPlayersList(landingPage);

        this.appContainer.appendChild(landingPage);
    }

    drawWelcomeMessage(landingPage) {
        const welcomeMessage = document.createElement('h1');

        welcomeMessage.textContent = 'Welcome to Atari Breakout!';
        welcomeMessage.style.fontSize = '2vw';
        welcomeMessage.style.color = "skyblue";

        landingPage.appendChild(welcomeMessage);
    }
    drawUsernameInput(landingPage) {
        const usernameInput = document.createElement('input');

        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Enter your username';
        usernameInput.style.marginTop = '20px';

        landingPage.appendChild(usernameInput);
    }
    drawPlayButton(landingPage) {
        const playButton = document.createElement('button');

        playButton.id = 'play-button';
        playButton.textContent = 'Play';
        playButton.style.marginTop = '20px';
        playButton.style.fontSize = '1vw';
        playButton.style.padding = '10px 20px';
        playButton.style.cursor = 'pointer';

        landingPage.appendChild(playButton);
    }

    drawPlayersList(landingPage) {
        const playersListContainer = document.createElement('div');

        playersListContainer.id = 'players-list';
        playersListContainer.style.marginTop = '30px';
        playersListContainer.style.textAlign = 'center';
        playersListContainer.style.color = 'gray';

        landingPage.appendChild(playersListContainer);

        // Call drawCurrentBestPlayers to populate the list
        this.drawCurrentBestPlayers(playersListContainer);
    }

    drawCurrentBestPlayers(playersListContainer) {
        if (!this.brain || !this.brain.players || !this.brain.players.length) {
            const noPlayersMessage = document.createElement('p');
            noPlayersMessage.textContent = 'No players registered yet.';
            playersListContainer.appendChild(noPlayersMessage);
            return;
        }

        // Iterate through the players and create an entry for each
        this.brain.players.forEach((player, index) => {
            const playerEntry = document.createElement('p');
            playerEntry.textContent = `${index + 1}. ${player.username} - ${player.score}`;
            playerEntry.style.margin = '5px 0'; // Add some spacing between player entries

            playersListContainer.appendChild(playerEntry);
        });
    }

    hideLandingPage() {
        document.getElementById('landing-page').style.visibility = 'hidden';
    }
    showLandingPage() {
        document.getElementById('landing-page').style.visibility = 'visible';
    }

    // MAIN FUNCTION
    clearAppContainer() {
        while (this.appContainer.firstChild) {
            this.appContainer.removeChild(this.appContainer.firstChild);
        }
    }

    draw() {
        this.clearAppContainer()
        this.setScreenDimensions();

        // Game elements
        this.drawBorder();
        this.drawPaddle(this.brain.paddle);
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