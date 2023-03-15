import { Ground, Obstacle, Road, RoadType, GroundType, Obstacles } from "./road_elements.js";

export class TurnSettings {
    constructor(turnAmount, turnCooldown, initialTurnProbability, turnProbabilityIncreaseFactor) {
        this.turnAmount = turnAmount;
        this.turnCooldown = turnCooldown;
        this.initialTurnProbability = initialTurnProbability;
        this.turnProbabilityIncreaseFactor = turnProbabilityIncreaseFactor;
    }
}

export class ObstacleSettings {
    /**
     * @param {number} maxObstacleFraction 
     * @param {number} obstacleCooldown 
     * @param {number} initialObstacleProbability 
     * @param {number} obstacleProbabilityIncreaseFactor 
     * @param {Array<Obstacle>} availableObstacles 
     */
    constructor(maxObstacleFraction, obstacleCooldown, initialObstacleProbability, obstacleProbabilityIncreaseFactor, availableObstacles) {
        this.maxObstacleFraction = maxObstacleFraction;
        this.obstacleCooldown = obstacleCooldown;
        this.initialObstacleProbability = initialObstacleProbability;
        this.obstacleProbabilityIncreaseFactor = obstacleProbabilityIncreaseFactor;
        this.availableObstacles = availableObstacles;
    }
}

export class WidthSettings {
    /**
     * @param {number} minWidth 
     * @param {number} maxWidth 
     * @param {number} widthChangeCooldown 
     * @param {number} initialWidthChangeProbability 
     * @param {number} widthProbabilityIncreaseFactor 
     * @param {number} changeAmount 
     */
    constructor(minWidth, maxWidth, widthChangeCooldown, initialWidthChangeProbability, widthProbabilityIncreaseFactor, changeAmount = 1) {
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.widthChangeCooldown = widthChangeCooldown;
        this.initialWidthChangeProbability = initialWidthChangeProbability;
        this.widthProbabilityIncreaseFactor = widthProbabilityIncreaseFactor;
        this.changeAmount = changeAmount;
    }
}

export class GameStage {
    /**
     * @param {string} label 
     * @param {Road} roadType 
     * @param {Ground} groundType 
     * @param {TurnSettings} turnSettings 
     * @param {ObstacleSettings} obstacleSettings 
     * @param {WidthSettings} widthSettings 
     */
    constructor(label, roadType, groundType, turnSettings, obstacleSettings, widthSettings = NO_WIDTH_CHANGE) {
        this.label = label;
        this.roadType = roadType;
        this.groundType = groundType;
        this.turnSettings = turnSettings;
        this.obstacleSettings = obstacleSettings;
        this.widthSettings = widthSettings;
    }
}

export class StageChange {
    constructor(label) {
        this.label = label;
    }
}

export const NO_WIDTH_CHANGE = new WidthSettings(15, 15, 20, 1, 1, 1);
export const NO_OBSTACLES = new ObstacleSettings(0, 20, 1, 1, []);

/**
 * @type {Map<number, GameStage>}
 */
export const GameStages = new Map([
    [0, new GameStage(
        "Highway",
        RoadType.Asphalt,
        GroundType.Grass,
        new TurnSettings(0.4, 50, 0.1, 1.1),
        new ObstacleSettings(0.3, 40, 0.1, 1.1, [Obstacles.BlueCar, Obstacles.WhiteCar, Obstacles.GreenTruck]),
    )],
    [400, new GameStage(
        "Forest",
        RoadType.Dirt,
        GroundType.Forest,
        new TurnSettings(0.8, 30, 0.1, 1.1),
        new ObstacleSettings(0.6, 30, 0.03, 1.1, [Obstacles.Rock, Obstacles.Puddle, Obstacles.WoodLog]),
        new WidthSettings(17, 30, 100, 0.05, 1.05),
    )],
    [800, new GameStage(
        "Busy Highway",
        RoadType.Asphalt,
        GroundType.Grass,
        new TurnSettings(0.4, 50, 0.1, 1.1),
        new ObstacleSettings(0.3, 5, 0.1, 1.1, [Obstacles.BlueCar, Obstacles.WhiteCar, Obstacles.GreenTruck]),
    )],
    [1200, new GameStage(
        "Narrow Bridge",
        RoadType.Bridge,
        GroundType.Water,
        new TurnSettings(0.3, 30, 0.1, 1.1),
        NO_OBSTACLES,
        new WidthSettings(7, 10, 50, 0.1, 1.1, 0.5),
    )],
]);
GameStages.finalStageLength = 400;
