export class Car {
    constructor() {
        this.X = 0;
        this.Y = 5;
        this.width = 3.5;
        this.height = 7;
        this._speedX = 0;
        this.ACCELERATION_X = 0.1;
        this.INITIAL_SPEED_X = 0.5;
        this.MAX_SPEED_X = 2;
    }

    get speedX() {
        return this._speedX;
    }

    set speedX(value) {
        this._speedX = Math.max(Math.min(value, this.MAX_SPEED_X), -this.MAX_SPEED_X);
    }
}