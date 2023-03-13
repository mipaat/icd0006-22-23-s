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
     * 
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

export class GameStage {
    /**
     * 
     * @param {string} label 
     * @param {Road} roadType 
     * @param {Ground} groundType 
     * @param {TurnSettings} turnSettings 
     * @param {ObstacleSettings} obstacleSettings 
     */
    constructor(label, roadType, groundType, turnSettings, obstacleSettings) {
        this.label = label;
        this.roadType = roadType;
        this.groundType = groundType;
        this.turnSettings = turnSettings;
        this.obstacleSettings = obstacleSettings;
    }
}

export class StageChange {
    constructor(label) {
        this.label = label;
    }
}

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
    [200, new GameStage(
        "Stage 2",
        RoadType.Dirt,
        GroundType.Swamp,
        new TurnSettings(0.8, 30, 0.1, 1.1),
        new ObstacleSettings(0.6, 70, 0.1, 1.1, [Obstacles.Rock]),
    )],
]);
GameStages.finalStageLength = 100;
