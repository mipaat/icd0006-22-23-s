export class Car {
    private _speedX: number = 0;
    private _speedY: number = 0;

    constructor(
        public X: number = 0,
        public Y: number = 5,
        public width: number = 1.5,
        public height: number = 3,
        public accelerationX: number = 0.1,
        public accelerationY: number = 0.1,
        public initialSpeedX: number = 0.5,
        public initialSpeedY: number = 0.5,
        private maxSpeedX: number = 2,
        private maxSpeedY: number = 1,
    ) { }

    get speedX() {
        return this._speedX;
    }

    set speedX(value) {
        this._speedX = Math.max(Math.min(value, this.maxSpeedX), -this.maxSpeedX);
    }

    get speedY() {
        return this._speedY;
    }

    set speedY(value) {
        this._speedY = Math.max(Math.min(value, this.maxSpeedY), -this.maxSpeedY);
    }
}