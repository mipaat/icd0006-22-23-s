import { ObstacleSettings, GameStage, TurnSettings, StageChange, GameStages } from "./game_stage";
import { PlacedObstacle, RoadSlice, RoadType, GroundType, Obstacle, Obstacles } from "./road_elements";
import { rollProbability } from "./utils";

export class RoadGenerator {
    public readonly road: Map<number, RoadSlice>;

    public generatedUpToCoordinate: number = 0;

    private headingLeftFor: number = 0;
    private headingRightFor: number = 0;

    private lastObstacleRowCoordinate: number = 100;
    private lastObstaclePercentage: number = 0;
    private lastObstacleAmount: number = 0;

    private widthIncreasingFor: number = 0;
    private widthDecreasingFor: number = 0;

    private _lastStage: GameStage | null = null;
    private lastStage: GameStage | null = null;
    private onStageFor: number = 0;
    private _lastStageFetchedAtCoordinate: number | null = null;

    private previousRoadSlice: RoadSlice | null = null;

    constructor(private readonly MAX_ROAD_WIDTH: number) {
        this.road = new Map<number, RoadSlice>();
    }

    get stage(): GameStage {
        if (this._lastStageFetchedAtCoordinate == this.generatedUpToCoordinate && this._lastStage) {
            return this._lastStage;
        }
        const keys = Array.from(GameStages.keys());
        const maxKey = Math.max(...keys);
        const coordinate = this.generatedUpToCoordinate % (maxKey + GameStages.finalStageLength);
        const stageKey = Math.max(...(keys.filter(r => r <= coordinate)));
        const result = GameStages.get(stageKey);
        if (!result) throw new Error("No available game stages!");
        this._lastStageFetchedAtCoordinate = this.generatedUpToCoordinate;
        this._lastStage = result;
        return result;
    }

    get turnSettings(): TurnSettings {
        return this.stage.turnSettings;
    }

    get obstacleSettings(): ObstacleSettings {
        return this.stage.obstacleSettings;
    }

    getTurnProbability(headingInDirectionFor: number): number {
        const power = -this.turnSettings.turnCooldown - Math.min(headingInDirectionFor, -this.turnSettings.turnCooldown);
        return Math.min(this.turnSettings.initialTurnProbability * (this.turnSettings.turnProbabilityIncreaseFactor ** power), 1);
    }

    getWidthChangeProbability(changingWidthInDirectionFor: number): number {
        const power = -this.stage.widthSettings.widthChangeCooldown - Math.min(changingWidthInDirectionFor, -this.stage.widthSettings.widthChangeCooldown);
        return Math.min(this.stage.widthSettings.initialWidthChangeProbability * (this.stage.widthSettings.widthProbabilityIncreaseFactor ** power), 1);
    }

    getStageChange(): StageChange | null {
        if (this.stage !== this.lastStage) {
            return new StageChange(this.stage.label);
        }
        return null;
    }

    widthIsTooSmall(width: number): boolean {
        return width < this.stage.widthSettings.minWidth;
    }

    widthIsTooLarge(width: number): boolean {
        return width > this.stage.widthSettings.maxWidth;
    }

    generateRow(): RoadSlice {
        if (this.lastStage !== this.stage) {
            this.onStageFor = 0;
            this.widthDecreasingFor = 0;
            this.widthIncreasingFor = 0;
            this.headingLeftFor = 0;
            this.headingRightFor = 0;
        } else {
            this.onStageFor++;
        }

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

        if (this.widthDecreasingFor <= 0 && this.widthIncreasingFor <= 0 && !this.widthIsTooLarge(width) && !this.widthIsTooSmall(width) &&
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

    generateRows(amount: number): void {
        let generatedAmount = 0;
        while (generatedAmount < amount) {
            let row = this.generateRow();
            generatedAmount += row.height;
        }
    }

    clearRowsBelow(height: number): void {
        for (const [key, roadSlice] of this.road.entries()) {
            if (key + roadSlice.height < height) {
                this.road.delete(key);
            }
        }
    }

    generateObstacles(roadSliceWidth: number): Array<PlacedObstacle> {
        const placedObstacles: Array<PlacedObstacle> = [];
        let maxObstacleHeight = 0;

        if (this.headingLeftFor > -10 || this.headingRightFor > -10 || this.onStageFor < 30) {
            return placedObstacles;
        }

        const power = Math.max(this.generatedUpToCoordinate - this.obstacleSettings.obstacleCooldown - this.lastObstacleRowCoordinate, 0);
        if (power > 0) {
            const probability = Math.min(this.obstacleSettings.initialObstacleProbability * (this.obstacleSettings.obstacleProbabilityIncreaseFactor ** power), 1);
            if (rollProbability(probability)) {
                const nerfBelowWidth = 15;
                let obstacleFractionMultiplier = 1;
                if (roadSliceWidth < nerfBelowWidth) {
                    obstacleFractionMultiplier = (roadSliceWidth / nerfBelowWidth) ** 2;
                }
                let maxObstacleWidthLeft = roadSliceWidth * this.obstacleSettings.maxObstacleFraction * obstacleFractionMultiplier * Math.random();
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

    obstacleIsOverlapping(obstacle: Obstacle, obstaclePositionX: number, placedObstacles: Array<PlacedObstacle>, roadSliceWidth: number): boolean {
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
