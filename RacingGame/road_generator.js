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

        this.previousRoadSlice = null;
    }

    getTurnProbability(headingInDirectionFor) {
        const power = -this.turnCooldown - Math.min(headingInDirectionFor, -this.turnCooldown);
        return Math.min(this.initialTurnProbability * (this.turnProbabilityIncreaseFactor ** power), 1);
    }

    generateRow() {
        let width = this.previousRoadSlice?.width ?? 30;

        let position = this.previousRoadSlice?.position ?? 0;

        let turningFor = this.headingLeftFor > 0 ? this.headingLeftFor : this.headingRightFor;
        let turnAmount = (this.headingLeftFor > 0 ? -1 : (this.headingRightFor > 0 ? 1 : 0)) * this.turnAmount;
        position += turnAmount;

        let leftRoadEdge = position - width * 0.5;
        let rightRoadEdge = position + width * 0.5;
        let positionAdjust = -Math.min(0, leftRoadEdge + this.MAX_ROAD_WIDTH / 2);
        positionAdjust -= Math.max(0, rightRoadEdge - this.MAX_ROAD_WIDTH / 2);
        position += positionAdjust;

        const row = new RoadSlice(RoadType.Asphalt, position, width, GroundType.Grass);
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
     * @param {number} position 
     * @param {number} width 
     * @param {Ground} groundType 
     * @param {Array<Obstacle>} obstacles 
     * @param {Array<GroundDecoration>} groundDecorations 
     */
    constructor(roadType, position, width, groundType, obstacles = [], groundDecorations = []) {
        this.roadType = roadType;
        this.position = position;
        this.width = width;
        this.height = 1;

        this.groundType = groundType;

        this.obstacles = obstacles;
        this.groundDecorations = groundDecorations;
    }
}

class Obstacle {
    constructor(width, image) {
        this.width = width;
        this.image = image;
    }
}

class PlacedObstacle {
    constructor(obstacle, position) {
        this.obstacle = obstacle;
        this.position = position;
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
