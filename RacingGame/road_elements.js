import { StageChange } from "./game_stage.js";

export class Obstacle {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

export class PlacedObstacle {
    /**
     * @param {Obstacle} obstacle
     * @param {number} positionX Horizontal position of the obstacle on a RoadSlice, as a fraction of its relative position along the slice width
     */
    constructor(obstacle, positionX) {
        this.obstacle = obstacle;
        /**
         * Horizontal position of the obstacle on a RoadSlice, as a fraction of its relative position along the slice width
         */
        this.positionX = positionX;
    }
}

export class RoadSlice {
    /**
     * @param {Road} roadType 
     * @param {number} positionX 
     * @param {number} positionY
     * @param {number} width 
     * @param {Ground} groundType 
     * @param {Array<PlacedObstacle>} obstacles 
     * @param {StageChange?} stageChange
     */
    constructor(roadType, positionX, positionY, width, groundType, obstacles = [], stageChange = null) {
        this.roadType = roadType;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = 1;

        this.groundType = groundType;

        this.obstacles = obstacles;

        this.stageChange = stageChange;
    }

    getMaxHeight() {
        return Math.max(this.height, ...this.obstacles.map((po) => {po.obstacle.height}));
    }
}

export class Road {
    /**
     * @param {string} color 
     */
    constructor(color) {
        this.color = color;
    }
}

export const RoadType = {
    Asphalt: new Road("#111"),
    Dirt: new Road("#965e26"),
    Bridge: new Road("#de7643"),
}

export class Ground {
    /**
     * @param {string} color 
     */
    constructor(color) {
        this.color = color;
    }
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