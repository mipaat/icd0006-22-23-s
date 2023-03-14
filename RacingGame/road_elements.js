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
    Swamp: new Ground("#2A1"),
}

export const Obstacles = {
    WoodLog: new Obstacle(4, 1, "#80310f"),
    Rock: new Obstacle(2, 2, "#333"),
}