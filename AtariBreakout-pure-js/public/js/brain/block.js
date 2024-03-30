export default class Block {
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