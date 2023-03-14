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
        "Stage 1",
        RoadType.Asphalt,
        GroundType.Grass,
        new TurnSettings(0.4, 50, 0.1, 1.1),
        new ObstacleSettings(0.4, 100, 0.1, 1.1, [Obstacles.WoodLog, Obstacles.Rock]),
    )],
    [400, new GameStage(
        "Stage 2",
        RoadType.Dirt,
        GroundType.Swamp,
        new TurnSettings(0.8, 30, 0.1, 1.1),
        new ObstacleSettings(0.6, 70, 0.1, 1.1, [Obstacles.Rock]),
        new WidthSettings(10, 30, 100, 0.05, 1.05),
    )],
]);
GameStages.finalStageLength = 400;
