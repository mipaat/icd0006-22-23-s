import { StageChange } from "./game_stage";

export class Obstacle {
    constructor(public readonly width: number, public readonly height: number, public readonly color: string) { }
}

export class PlacedObstacle {
    /**
     * @param {Obstacle} obstacle
     * @param {number} positionX Horizontal position of the obstacle on a RoadSlice, as a fraction of its relative position along the slice width
     */
    constructor(public readonly obstacle: Obstacle, public readonly positionX: number) { }
}

export class RoadSlice {
    constructor(
        public readonly roadType: Road,
        public readonly positionX: number,
        public readonly positionY: number,
        public readonly width: number,
        public readonly groundType: Ground,
        public readonly obstacles: Array<PlacedObstacle> = [],
        public readonly stageChange: StageChange | null = null,
        public readonly height: number = 1,
        ) { }

    getMaxHeight() {
        return Math.max(this.height, ...this.obstacles.map((po) => { return po.obstacle.height }));
    }
}

export class Road {
    constructor(public readonly color: string) { }
}

export const RoadType = {
    Asphalt: new Road("#111"),
    Dirt: new Road("#965e26"),
    Bridge: new Road("#de7643"),
}

export class Ground {
    constructor(public readonly color: string) { }
}

export const GroundType = {
    Grass: new Ground("#0F0"),
    Forest: new Ground("#082e15"),
    Water: new Ground("#11448c"),
}

export const Obstacles = {
    WoodLog: new Obstacle(4, 1, "#291204"),
    Rock: new Obstacle(2, 2, "#333"),
    BlueCar: new Obstacle(1.5, 3, "#00B"),
    WhiteCar: new Obstacle(1.5, 3, "#dedede"),
    GreenTruck: new Obstacle(1.8, 6, "#85deb0"),
    Puddle: new Obstacle(3, 2.5, "#094b91"),
}