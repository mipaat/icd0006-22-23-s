import { Obstacle } from "./road_elements.js";

export class GameStage {
    constructor(rowsPerSecond) {
        this.rowsPerSecond = rowsPerSecond;
    }
}

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

export class RoadGenerationStage {
    constructor(label, roadType, groundType, turnSettings, obstacleSettings) {
        this.label = label;
        this.roadType = roadType;
        this.groundType = groundType;
        this.turnSettings = turnSettings;
        this.obstacleSettings = obstacleSettings;
    }
}
