export default class Player {
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