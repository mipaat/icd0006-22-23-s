export class RoadGenerator {
    constructor() {
        /**
         * @type {Map<number, RoadSlice>}
         */
        this.road = new Map();
        this.generatedUpToCoordinate = 0;
    }

    generateRow() {
        // TODO: proper generation
        let row = new RoadSlice(RoadType.Asphalt, 0, 20, GroundType.Grass);
        this.road.set(this.generatedUpToCoordinate, row);
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
    Asphalt: new Road("#000"),
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
     * @param {number} middle 
     * @param {number} width 
     * @param {Ground} groundType 
     * @param {Array<Obstacle>} obstacles 
     * @param {Array<GroundDecoration>} groundDecorations 
     */
    constructor(roadType, middle, width, groundType, obstacles = [], groundDecorations = []) {
        this.roadType = roadType;
        this.middle = middle;
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
