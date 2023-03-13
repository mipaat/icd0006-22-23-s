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
        this.turnAmount = 0.4;
        this.turnCooldown = 50;
        this.initialTurnProbability = 0.1;
        this.turnProbabilityIncreaseFactor = 1.1;

        this.maxObstacleAmount = 2;
        this.obstacleCooldown = 100;
        this.lastObstacleRowCoordinate = 100;
        this.lastObstacleAmount = 0;
        this.initialObstacleProbability = 0.1;
        this.obstacleProbabilityIncreaseFactor = 1.1;

        /**
         * @type {RoadSlice?}
         */
        this.previousRoadSlice = null;
    }

    getTurnProbability(headingInDirectionFor) {
        const power = -this.turnCooldown - Math.min(headingInDirectionFor, -this.turnCooldown);
        return Math.min(this.initialTurnProbability * (this.turnProbabilityIncreaseFactor ** power), 1);
    }

    generateRow() {
        let width = this.previousRoadSlice?.width ?? 15;

        let position = this.previousRoadSlice?.positionX ?? 0;

        let turningFor = this.headingLeftFor > 0 ? this.headingLeftFor : this.headingRightFor;
        let turnAmount = (this.headingLeftFor > 0 ? -1 : (this.headingRightFor > 0 ? 1 : 0)) * this.turnAmount;
        position += turnAmount;

        let leftRoadEdge = position - width * 0.5;
        let rightRoadEdge = position + width * 0.5;
        let positionAdjust = -Math.min(0, leftRoadEdge + this.MAX_ROAD_WIDTH / 2);
        positionAdjust -= Math.max(0, rightRoadEdge - this.MAX_ROAD_WIDTH / 2);
        position += positionAdjust;

        const obstacles = this.generateObstacles(width);
        const row = new RoadSlice(RoadType.Asphalt, position, this.generatedUpToCoordinate, width, GroundType.Grass, obstacles);

        this.road.set(this.generatedUpToCoordinate, row);
        this.previousRoadSlice = row;
        this.generatedUpToCoordinate += row.height;

        this.headingLeftFor -= row.height;
        this.headingRightFor -= row.height;

        if (this.headingLeftFor < -this.turnCooldown && this.headingRightFor < -this.turnCooldown) {
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

        const power = Math.max(this.generatedUpToCoordinate - this.obstacleCooldown - this.lastObstacleRowCoordinate, 0);
        if (power > 0) {
            const probability = Math.min(this.initialObstacleProbability * (this.obstacleProbabilityIncreaseFactor ** power), 1);
            if (rollProbability(probability)) {
                const obstacleAmountMultiplier = Math.ceil(Math.random() * this.maxObstacleAmount);
                const obstacleAmount = Math.ceil(roadSliceWidth * obstacleAmountMultiplier / 20);
                for (let index = 0; index < obstacleAmount; index++) {
                    obstacles.push(new PlacedObstacle(new Obstacle(4, 2, null), Math.random() - 0.5));
                    maxObstacleHeight = 2;
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

class Road {
    /**
     * @param {string} color 
     */
    constructor(color) {
        this.color = color;
    }
}

const RoadType = {
    Asphalt: new Road("#111"),
}

class Ground {
    /**
     * @param {string} color 
     */
    constructor(color) {
        this.color = color;
    }
}

const GroundType = {
    Grass: new Ground("#0F0"),
}

export class RoadSlice {
    /**
     * @param {Road} roadType 
     * @param {number} positionX 
     * @param {number} positionY
     * @param {number} width 
     * @param {Ground} groundType 
     * @param {Array<PlacedObstacle>} obstacles 
     * @param {Array<GroundDecoration>} groundDecorations 
     */
    constructor(roadType, positionX, positionY, width, groundType, obstacles = [], groundDecorations = []) {
        this.roadType = roadType;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = 1;

        this.groundType = groundType;

        this.obstacles = obstacles;
        this.groundDecorations = groundDecorations;
    }
}

class Obstacle {
    constructor(width, height, image) {
        this.width = width;
        this.height = height;
        this.image = image;
    }
}

class PlacedObstacle {
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

class GroundDecoration {
    constructor(width, image) {
        this.width = width;
        this.image = image
    }
}

class PlacedGroundDecoration {
    constructor(groundDecoration, position) {
        this.groundDecoration = groundDecoration;
        this.position = position;
    }
}
