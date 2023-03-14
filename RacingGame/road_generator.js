import { ObstacleSettings, GameStage, TurnSettings, StageChange, GameStages } from "./game_stage.js";
import { PlacedObstacle, RoadSlice, RoadType, GroundType, Obstacle, Obstacles } from "./road_elements.js";
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

        this.widthIncreasingFor = 0;
        this.widthDecreasingFor = 0;

        /**
         * @type {GameStage?}
         */
        this.lastStage = null;

        /**
         * @type {RoadSlice?}
         */
        this.previousRoadSlice = null;
    }

    /**
     * @type {GameStage}
     */
    get stage() {
        if (this._lastStageFetchedAtCoordinate == this.generatedUpToCoordinate && this._lastStage) {
            return this._lastStage;
        }
        const keys = Array.from(GameStages.keys());
        const maxKey = Math.max(...keys);
        const coordinate = this.generatedUpToCoordinate % (maxKey + GameStages.finalStageLength);
        const stageKey = Math.max(...(keys.filter(r => r <= coordinate)));
        const result = GameStages.get(stageKey);
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

    getWidthChangeProbability(changingWidthInDirectionFor) {
        const power = -this.stage.widthSettings.widthChangeCooldown - Math.min(changingWidthInDirectionFor, -this.stage.widthSettings.widthChangeCooldown);
        return Math.min(this.stage.widthSettings.initialWidthChangeProbability * (this.stage.widthSettings.widthProbabilityIncreaseFactor ** power), 1);
    }

    getStageChange() {
        if (this.stage !== this.lastStage) {
            return new StageChange(this.stage.label);
        }
        return null;
    }

    widthIsTooSmall(width) {
        return width < this.stage.widthSettings.minWidth;
    }

    widthIsTooLarge(width) {
        return width > this.stage.widthSettings.maxWidth;
    }

    generateRow() {
        let width = this.previousRoadSlice?.width ?? this.stage.widthSettings.minWidth;
        const previousWidth = width;
        if (this.widthDecreasingFor > 0) {
            width -= this.stage.widthSettings.changeAmount;
            if (this.widthIsTooSmall(width) && !this.widthIsTooSmall(previousWidth)) {
                width = this.stage.widthSettings.minWidth;
                this.widthDecreasingFor = 0;
            }
        } else if (this.widthIncreasingFor > 0) {
            width += this.stage.widthSettings.changeAmount;
            if (width > this.MAX_ROAD_WIDTH) {
                width = this.MAX_ROAD_WIDTH;
            }
            if (this.widthIsTooLarge(width) && !this.widthIsTooLarge(previousWidth)) {
                width = this.stage.widthSettings.maxWidth;
                this.widthIncreasingFor = 0;
            }
        }

        let position = this.previousRoadSlice?.positionX ?? 0;

        let turnAmount = (this.headingLeftFor > 0 ? -1 : (this.headingRightFor > 0 ? 1 : 0)) * this.turnSettings.turnAmount;
        position += turnAmount;

        let leftRoadEdge = position - width * 0.5;
        let rightRoadEdge = position + width * 0.5;
        let positionAdjust = -Math.min(0, leftRoadEdge + this.MAX_ROAD_WIDTH / 2);
        positionAdjust -= Math.max(0, rightRoadEdge - this.MAX_ROAD_WIDTH / 2);
        position += positionAdjust;

        const obstacles = this.generateObstacles(width);
        const row = new RoadSlice(this.stage.roadType, position, this.generatedUpToCoordinate, width, this.stage.groundType, obstacles, this.getStageChange());

        this.road.set(this.generatedUpToCoordinate, row);

        this.headingLeftFor -= row.height;
        this.headingRightFor -= row.height;

        if (this.widthDecreasingFor <= 0 && this.widthIncreasingFor <= 0 &&
            this.headingLeftFor < -this.turnSettings.turnCooldown && this.headingRightFor < -this.turnSettings.turnCooldown) {
            const turningLeftProbability = this.getTurnProbability(this.headingLeftFor);
            const turningRightProbability = this.getTurnProbability(this.headingRightFor);
            const shouldStartTurningLeft = rollProbability(turningLeftProbability);
            const shouldStartTurningRight = rollProbability(turningRightProbability);
            const headingInDirectionFor = 30 + ((Math.random() - 0.5) * 2 * 20); // Maybe these parameters should be determined in TurnSettings?
            if (shouldStartTurningLeft && shouldStartTurningRight) {
                const pickLeft = rollProbability(0.5);
                if (pickLeft) {
                    this.headingLeftFor = headingInDirectionFor;
                } else {
                    this.headingRightFor = headingInDirectionFor;
                }
            } else if (shouldStartTurningLeft) {
                this.headingLeftFor = headingInDirectionFor;
            } else if (shouldStartTurningRight) {
                this.headingRightFor = headingInDirectionFor;
            }
        }

        this.widthIncreasingFor -= row.height;
        this.widthDecreasingFor -= row.height;

        if (this.headingLeftFor <= 0 && this.headingRightFor <= 0) {
            if (this.widthIsTooLarge(row.width)) {
                this.widthDecreasingFor = 5;
            } else if (this.widthIsTooSmall(row.width)) {
                this.widthIncreasingFor = 5;
            }
            else if (this.widthDecreasingFor < -this.stage.widthSettings.widthChangeCooldown && this.widthIncreasingFor < -this.stage.widthSettings.widthChangeCooldown) {
                const widthIncreasingProbability = this.getWidthChangeProbability(this.widthIncreasingFor);
                const widthDecreasingProbability = this.getWidthChangeProbability(this.widthDecreasingFor);
                const shouldStartIncreasingWidth = rollProbability(widthIncreasingProbability);
                const shouldStartDecreasingWidth = rollProbability(widthDecreasingProbability);
                const changeSizeFor = 20;
                if (shouldStartDecreasingWidth && shouldStartIncreasingWidth) {
                    const pickDecrease = rollProbability(0.5);
                    if (pickDecrease) {
                        this.widthDecreasingFor = changeSizeFor;
                    } else {
                        this.widthIncreasingFor = changeSizeFor;
                    }
                } else if (shouldStartDecreasingWidth) {
                    this.widthDecreasingFor = changeSizeFor;
                } else if (shouldStartIncreasingWidth) {
                    this.widthIncreasingFor = changeSizeFor;
                }
            }
        }

        this.lastStage = this.stage;
        this.previousRoadSlice = row;
        this.generatedUpToCoordinate += row.height;
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
            if (key + this.road.get(key).height < height) {
                this.road.delete(key);
            }
        }
    }

    /**
     * @param {number} roadSliceWidth 
     * @returns {Array<PlacedObstacle>}
     */
    generateObstacles(roadSliceWidth) {
        const placedObstacles = [];
        let maxObstacleHeight = 0;

        if (this.headingLeftFor > 0 || this.headingRightFor > 0) {
            return placedObstacles;
        }

        const power = Math.max(this.generatedUpToCoordinate - this.obstacleSettings.obstacleCooldown - this.lastObstacleRowCoordinate, 0);
        if (power > 0) {
            const probability = Math.min(this.obstacleSettings.initialObstacleProbability * (this.obstacleSettings.obstacleProbabilityIncreaseFactor ** power), 1);
            if (rollProbability(probability)) {
                let maxObstacleWidthLeft = roadSliceWidth * this.obstacleSettings.maxObstacleFraction * Math.random();
                while (maxObstacleWidthLeft > 0) {
                    const potentialObstacles = this.obstacleSettings.availableObstacles.filter(o => o.width <= maxObstacleWidthLeft);
                    if (potentialObstacles.length == 0) {
                        break;
                    }
                    const obstacleIndex = Math.floor(Math.random() * (potentialObstacles.length));
                    const obstacle = potentialObstacles[obstacleIndex];
                    maxObstacleWidthLeft -= obstacle.width;
                    maxObstacleHeight = Math.max(maxObstacleHeight, obstacle.height);
                    let obstaclePositionX = (Math.random() - 0.5) * roadSliceWidth;
                    if (this.obstacleIsOverlapping(obstacle, obstaclePositionX, placedObstacles, roadSliceWidth)) {
                        let found = false;
                        for (let offset = 1; !found && offset < roadSliceWidth; offset++) {
                            for (const multiplier of [1, -1]) {
                                const newObstaclePositionX = obstaclePositionX + offset * multiplier;
                                if (!this.obstacleIsOverlapping(obstacle, newObstaclePositionX, placedObstacles, roadSliceWidth)) {
                                    obstaclePositionX = newObstaclePositionX;
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            break;
                        }
                    }
                    placedObstacles.push(new PlacedObstacle(obstacle, obstaclePositionX));
                }
            }
        }

        if (placedObstacles.length > 0) {
            this.lastObstacleAmount = placedObstacles.length;
            this.lastObstacleRowCoordinate = this.generatedUpToCoordinate + maxObstacleHeight - 1;
        }
        return placedObstacles;
    }

    /**
     * 
     * @param {Obstacle} obstacle 
     * @param {number} obstaclePositionX 
     * @param {Array<PlacedObstacle>} placedObstacles 
     * @param {number} roadSliceWidth 
     * @returns {boolean}
     */
    obstacleIsOverlapping(obstacle, obstaclePositionX, placedObstacles, roadSliceWidth) {
        const obstacleLeft = obstaclePositionX - obstacle.width / 2;
        const obstacleRight = obstaclePositionX + obstacle.width / 2;
        if (obstacleLeft < -roadSliceWidth / 2 || obstacleRight > roadSliceWidth / 2) {
            return true;
        }
        for (const placedObstacle of placedObstacles) {
            const placedObstacleLeft = placedObstacle.positionX - placedObstacle.obstacle.width / 2;
            const placedObstacleRight = placedObstacle.positionX + placedObstacle.obstacle.width / 2;
            if (obstacleLeft < placedObstacleRight && obstacleRight > placedObstacleLeft) {
                return true;
            }
        }
        return false;
    }
}
