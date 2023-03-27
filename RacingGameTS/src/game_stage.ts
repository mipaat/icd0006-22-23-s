import { Ground, Obstacle, Road, RoadType, GroundType, Obstacles } from "./road_elements";

export class TurnSettings {
    constructor(
        public readonly turnAmount: number,
        public readonly turnCooldown: number,
        public readonly initialTurnProbability: number,
        public readonly turnProbabilityIncreaseFactor: number
    ) { }
}

export class ObstacleSettings {
    constructor(
        public readonly maxObstacleFraction: number,
        public readonly obstacleCooldown: number,
        public readonly initialObstacleProbability: number,
        public readonly obstacleProbabilityIncreaseFactor: number,
        public readonly availableObstacles: Array<Obstacle>
    ) { }
}

export class WidthSettings {
    constructor(
        public readonly minWidth: number,
        public readonly maxWidth: number,
        public readonly widthChangeCooldown: number,
        public readonly initialWidthChangeProbability: number,
        public readonly widthProbabilityIncreaseFactor: number,
        public readonly changeAmount: number = 1
    ) { }
}

export class GameStage {
    constructor(
        public readonly label: string,
        public readonly roadType: Road,
        public readonly groundType: Ground,
        public readonly turnSettings: TurnSettings,
        public readonly obstacleSettings: ObstacleSettings,
        public readonly widthSettings: WidthSettings = NO_WIDTH_CHANGE
    ) { }
}

export class StageChange {
    constructor(public readonly label: string) { }
}

export const NO_WIDTH_CHANGE = new WidthSettings(15, 15, 20, 1, 1, 1);
export const NO_OBSTACLES = new ObstacleSettings(0, 20, 1, 1, []);

export class GameStageMap extends Map<number, GameStage> {
    constructor(indexedGameStages: readonly (readonly [number, GameStage])[], public readonly finalStageLength: number = 400) {
        super(indexedGameStages);
    }
}
export const GameStages: GameStageMap = new GameStageMap([
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
