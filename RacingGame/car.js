export class Car {
    constructor() {
        this.X = 0;
        this.Y = 5;
        this.width = 1.5;
        this.height = 3;
        this._speedX = 0;
        this._speedY = 0;
        this.ACCELERATION_X = 0.1;
        this.ACCELERATION_Y = 0.1;
        this.INITIAL_SPEED_X = 0.5;
        this.INITIAL_SPEED_Y = 0.5;
        this.MAX_SPEED_X = 2;
        this.MAX_SPEED_Y = 1;
    }

    get speedX() {
        return this._speedX;
    }

    set speedX(value) {
        this._speedX = Math.max(Math.min(value, this.MAX_SPEED_X), -this.MAX_SPEED_X);
    }

    get speedY() {
        return this._speedY;
    }

    set speedY(value) {
        this._speedY = Math.max(Math.min(value, this.MAX_SPEED_Y), -this.MAX_SPEED_Y);
    }
}