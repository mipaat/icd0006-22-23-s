import { ObstacleSettings, RoadGenerationStage, TurnSettings } from "./game_stage.js";
import { PlacedObstacle, RoadSlice, RoadType, GroundType, Obstacle } from "./road_elements.js";
import { rollProbability } from "./utils.js";

export class RoadGenerator {
    constructor(maxRoadWidth) {
        /**
         * @type {Map<number, RoadSlice>}
         */
        this.road = new Map();
        this.generatedUpToCoordinate = 0;

        this.MAX_ROAD_WIDTH = maxRoadWidth;

        this.headingLeftFor = 0;
        this.headingRightFor = 0;

        this.lastObstacleRowCoordinate = 100;
        this.lastObstaclePercentage = 0;

        /**
         * @type {RoadSlice?}
         */
        this.previousRoadSlice = null;
    }

    /**
     * @type {RoadGenerationStage}
     */
    get stage() {
        if (this._lastStageFetchedAtCoordinate == this.generatedUpToCoordinate && this._lastStage) {
            return this._lastStage;
        }
        const stageKey = Math.max(...(Array.from(RoadGenerationStages.keys()).filter(r => r <= this.generatedUpToCoordinate)));
        const result = RoadGenerationStages.get(stageKey);
        this._lastStageFetchedAtCoordinate = this.generatedUpToCoordinate;
        this._lastStage = result;
        return result;
    }

    /**
     * @type {TurnSettings}
     */
    get turnSettings() {
        return this.stage.turnSettings;
    }

    /**
     * @type {ObstacleSettings}
     */
    get obstacleSettings() {
        return this.stage.obstacleSettings;
    }

    getTurnProbability(headingInDirectionFor) {
        const power = -this.turnSettings.turnCooldown - Math.min(headingInDirectionFor, -this.turnSettings.turnCooldown);
        return Math.min(this.turnSettings.initialTurnProbability * (this.turnSettings.turnProbabilityIncreaseFactor ** power), 1);
    }

    generateRow() {
        let width = this.previousRoadSlice?.width ?? 15;

        let position = this.previousRoadSlice?.positionX ?? 0;

        let turningFor = this.headingLeftFor > 0 ? this.headingLeftFor : this.headingRightFor;
        let turnAmount = (this.headingLeftFor > 0 ? -1 : (this.headingRightFor > 0 ? 1 : 0)) * this.turnSettings.turnAmount;
        position += turnAmount;

        let leftRoadEdge = position - width * 0.5;
        let rightRoadEdge = position + width * 0.5;
        let positionAdjust = -Math.min(0, leftRoadEdge + this.MAX_ROAD_WIDTH / 2);
        positionAdjust -= Math.max(0, rightRoadEdge - this.MAX_ROAD_WIDTH / 2);
        position += positionAdjust;

        const obstacles = this.generateObstacles(width);
        const row = new RoadSlice(this.stage.roadType, position, this.generatedUpToCoordinate, width, this.stage.groundType, obstacles);

        this.road.set(this.generatedUpToCoordinate, row);
        this.previousRoadSlice = row;
        this.generatedUpToCoordinate += row.height;

        this.headingLeftFor -= row.height;
        this.headingRightFor -= row.height;

        if (this.headingLeftFor < -this.turnSettings.turnCooldown && this.headingRightFor < -this.turnSettings.turnCooldown) {
            const turningLeftProbability = this.getTurnProbability(this.headingLeftFor);
            const turningRightProbability = this.getTurnProbability(this.headingRightFor);
            const shouldStartTurningLeft = rollProbability(turningLeftProbability);
            const shouldStartTurningRight = rollProbability(turningRightProbability);
            if (shouldStartTurningLeft && shouldStartTurningRight) {
                const pickLeft = rollProbability(0.5);
                let headingInDirectionFor = 30 + ((Math.random() - 0.5) * 2 * 20);
                if (pickLeft) {
                    this.headingLeftFor = headingInDirectionFor;
                } else {
                    this.headingRightFor = headingInDirectionFor;
                }
            }
        }

        return row;
    }

    generateRows(amount) {
        let generatedAmount = 0;
        while (generatedAmount < amount) {
            let row = this.generateRow();
            generatedAmount += row.height;
        }
    }

    clearRowsBelow(height) {
        for (const key of this.road.keys()) {
            if (key < height) {
                this.road.delete(key);
            }
        }
    }

    /**
     * @param {number} roadSliceWidth 
     * @returns {Array<PlacedObstacle>}
     */
    generateObstacles(roadSliceWidth) {
        const obstacles = [];
        let maxObstacleHeight = 0;

        const power = Math.max(this.generatedUpToCoordinate - this.obstacleSettings.obstacleCooldown - this.lastObstacleRowCoordinate, 0);
        if (power > 0) {
            const probability = Math.min(this.obstacleSettings.initialObstacleProbability * (this.obstacleSettings.obstacleProbabilityIncreaseFactor ** power), 1);
            if (rollProbability(probability)) {
                let maxObstacleWidthLeft = roadSliceWidth * this.obstacleSettings.maxObstacleFraction;
                while (maxObstacleWidthLeft > 0) {
                    const obstacle = new Obstacle(4, 2, "#523");
                    maxObstacleWidthLeft -= obstacle.width;
                    obstacles.push(new PlacedObstacle(obstacle, (Math.random() - 0.5) * 2 * roadSliceWidth));
                }
            }
        }

        if (obstacles.length > 0) {
            this.lastObstacleAmount = obstacles.length;
            this.lastObstacleRowCoordinate = this.generatedUpToCoordinate + maxObstacleHeight - 1;
        }
        return obstacles;
    }
}

/**
 * @type {Map<number, RoadGenerationStage>}
 */
const RoadGenerationStages = new Map([
    [0, new RoadGenerationStage(
        "Stage 1",
        RoadType.Asphalt,
        GroundType.Grass,
        new TurnSettings(0.4, 50, 0.1, 1.1),
        new ObstacleSettings(0.4, 100, 0.1, 1.1),
    )],
    [1000, new RoadGenerationStage(
        "Stage 2",
        RoadType.Dirt,
        GroundType.Grass,
        new TurnSettings(0.8, 30, 0.1, 1.1),
        new ObstacleSettings(0.6, 70, 0.1, 1.1),
    )],
]);
