import Block from "./block.js";

export default class BlockContainer {
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

        this.createBlockContainer();
    }

    createBlockContainer() {
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

    updateBlockContainer() {
        let tempBlockArr = this.blockArr.filter(block => !block.break);

        // Clear the existing block array
        this.blockArr = [...tempBlockArr];

        // Update the count to reflect current non-broken blocks
        this.count = this.blockArr.length;
    }
}