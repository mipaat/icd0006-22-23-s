import { EventType } from "./enums/event_type";
import { RacingGame } from "./racing_game";
import { RoadGenerator } from "./road_generator";
import { PauseMenu } from "./pause_menu";
import { removeAllChildNodes } from "./utils";
import { Car } from "./car";
import { GameStages } from "./game_stage";
import { KeyStatus } from "./KeyStatus";
import { Key } from "ts-key-enum";
import { MyKey } from "./enums/my_key";
import { HUD } from "./hud";
import { EndScreen } from "./end_screen";

export class GameBrain {
    public readonly HEIGHT: number = 50;
    public static readonly MIN_HUD_HEIGHT: number = 50;
    public static readonly MIN_HEIGHT_PX: number = 200;
    public static readonly MAX_ROAD_WIDTH: number = 40;
    public static readonly LOGIC_PER_SECOND: number = 30;

    public racingGame: RacingGame;
    private get app() {
        return this.racingGame.app;
    }
    public pauseMenu: PauseMenu;
    private readonly roadGenerator: RoadGenerator;
    private readonly HUD: HUD;
    private readonly keys: Map<string, KeyStatus>;

    private readonly car: Car;

    public hudHeight: number;
    public rowsPerSecond: number = 50;
    public paused: boolean = false;
    public health: number = 3;
    private invincibleForSeconds = 0;
    public stageLabel: string;
    private screenBottom: number = 0;
    private stageChanges: number = 0;
    private previousSpeedIncreaseAtLevel: number = 0;
    
    public score: number = 0;
    private readonly BASE_SCORE_PER_ROW: number = 1;
    public scoreMultiplier: number = 1;
    private readonly SCORE_MULTIPLIER_EXPONENT: number = 2.5;
    private readonly SCORE_MULTIPLIER_AT_SCREEN_TOP: number = 4;
    
    private readonly SPEED_INCREASE_AT_LEVEL_LOOP: number = 10;

    private _fpsIntervalId: number | null = null;
    private _logicIntervalId: number | null = null;

    constructor(racingGame: RacingGame) {
        this.hudHeight = GameBrain.MIN_HUD_HEIGHT;

        this.racingGame = racingGame;
        this.unPause()
        this.pauseMenu = new PauseMenu(this);

        window.addEventListener(EventType.Resize, this.onResize);

        this.keys = new Map<string, KeyStatus>();
        this.registerKeys(Key.ArrowLeft, Key.ArrowRight, Key.ArrowDown, Key.ArrowUp, MyKey.W, MyKey.A, MyKey.S, MyKey.D);
        this.racingGame.app.addEventListener(EventType.KeyDown, this.handleKeyDown);
        this.racingGame.app.addEventListener(EventType.KeyUp, this.handleKeyUp);

        this.car = new Car();

        this.roadGenerator = new RoadGenerator(GameBrain.MAX_ROAD_WIDTH);
        this.stageLabel = this.roadGenerator.stage.label;
        this.roadGenerator.generateRows(Math.ceil(this.HEIGHT));

        this.HUD = new HUD(this);
        this._onResize();
    }

    registerKeys(this: GameBrain, ...keyCodes: Array<string>) {
        for (const keyCode of keyCodes) {
            if (!this.keys.has(keyCode)) {
                this.keys.set(keyCode, new KeyStatus());
            }
        }
    }

    _handleKeyDown(this: GameBrain, event: KeyboardEvent) {
        const keyStatus = this.keys.get(event.key);
        if (keyStatus) {
            keyStatus.pressed = true;
        }
    }

    handleKeyDown = (event: KeyboardEvent) => {
        this._handleKeyDown(event);
    }

    _handleKeyUp(this: GameBrain, event: KeyboardEvent) {
        const keyStatus = this.keys.get(event.key);
        if (keyStatus) {
            keyStatus.pressed = false;
        }
    }

    handleKeyUp = (event: KeyboardEvent) => {
        this._handleKeyUp(event);
    }

    deactivate() {
        this.racingGame.app.removeEventListener(EventType.KeyDown, this.handleKeyDown);
        this.racingGame.app.removeEventListener(EventType.KeyUp, this.handleKeyUp);
        window.removeEventListener(EventType.Resize, this.onResize);
        removeAllChildNodes(this.racingGame.bgLayer);
        removeAllChildNodes(this.racingGame.roadLayer);
        removeAllChildNodes(this.racingGame.mainLayer);
        removeAllChildNodes(this.racingGame.obstacleLayer);
        this.setFps(0);
        this.setLogicInterval(0);
        this.pauseMenu.deactivate();
        this.HUD.deactivate();
    }

    get screenTop(): number {
        return this.screenBottom + this.HEIGHT;
    }

    vhValue(value: number) {
        const vhMultiplier = 100 / (this.HEIGHT + this.hudHeight);
        return `${vhMultiplier * value}vh`;
    }

    get scale(): number {
        return window.innerHeight / (this.HEIGHT + this.hudHeight);
    }

    _render(this: GameBrain) {
        removeAllChildNodes(this.racingGame.bgLayer);
        removeAllChildNodes(this.racingGame.roadLayer);
        removeAllChildNodes(this.racingGame.mainLayer);
        removeAllChildNodes(this.racingGame.obstacleLayer);
        const children = [];

        const emptyHUDBg = document.createElement("div");
        emptyHUDBg.style.height = this.vhValue(this.hudHeight);
        this.racingGame.bgLayer.appendChild(emptyHUDBg);
        const emptyHUDRoad = document.createElement("div");
        emptyHUDRoad.style.height = this.vhValue(this.hudHeight);
        this.racingGame.roadLayer.appendChild(emptyHUDRoad);

        for (const entry of this.roadGenerator.road.entries()) {
            const coordinateY = entry[0];
            const roadSlice = entry[1];

            if (coordinateY > this.screenTop) continue;
            if (coordinateY + roadSlice.height < this.screenBottom) {
                if (coordinateY + roadSlice.getMaxHeight() < this.screenBottom) {
                    continue;
                }
            }

            const groundElement = document.createElement("div");
            groundElement.style.height = this.vhValue(roadSlice.height);
            groundElement.style.width = "100%";
            groundElement.style.background = roadSlice.groundType.color;
            groundElement.style.fontSize = this.vhValue(roadSlice.height * 0.7);

            const roadElement = document.createElement("div");
            roadElement.style.height = this.vhValue(roadSlice.height);
            roadElement.style.width = this.vhValue(roadSlice.width);
            roadElement.style.background = roadSlice.roadType.color;
            roadElement.style.position = "relative";
            const roadSliceCenterPx = window.innerWidth / 2 + roadSlice.positionX * this.scale;
            roadElement.style.left = `${roadSliceCenterPx - (roadSlice.width / 2) * this.scale}px`;

            for (const placedObstacle of roadSlice.obstacles) {
                const obstacleElement = document.createElement("div");
                obstacleElement.style.height = this.vhValue(placedObstacle.obstacle.height);
                obstacleElement.style.width = this.vhValue(placedObstacle.obstacle.width);
                obstacleElement.style.background = placedObstacle.obstacle.color;
                obstacleElement.style.position = "absolute";
                obstacleElement.style.left = `${roadSliceCenterPx + placedObstacle.positionX * this.scale - placedObstacle.obstacle.width / 2 * this.scale}px`;
                obstacleElement.style.top = `${window.innerHeight - (roadSlice.positionY - this.screenBottom + placedObstacle.obstacle.height) * this.scale}px`;

                this.racingGame.obstacleLayer.appendChild(obstacleElement);
            }

            children.push({groundElement, roadElement});
        }
        for (const element of children.reverse()) {
            this.racingGame.bgLayer.appendChild(element.groundElement);
            this.racingGame.roadLayer.appendChild(element.roadElement);
        }

        const carElement = document.createElement("div");
        carElement.style.height = this.vhValue(this.car.height);
        carElement.style.width = this.vhValue(this.car.width);
        carElement.style.background = "#F00";
        carElement.style.opacity = this.invincibleForSeconds <= 0 ? "1" : "0.5";
        carElement.style.position = "absolute";
        carElement.style.left = `${window.innerWidth / 2 - (this.car.width / 2) * this.scale + this.car.X * this.scale}px`;
        carElement.style.top = this.vhValue(this.HEIGHT + this.hudHeight - (this.car.Y + this.car.height));
        this.racingGame.mainLayer.appendChild(carElement);
    }

    render = () => {
        this._render();
    }

    get rowsPerSecondScaleFactor() {
        return this.rowsPerSecond / 40;
    }

    get logicPerSecondScaleFactor() { // Might be wrong, but seems fine for now?
        return 30 / GameBrain.LOGIC_PER_SECOND;
    }

    _advanceLogic(this: GameBrain) {
        for (const key of this.keys.values()) {
            if (key.pressed) {
                key.heldFor++;
            } else {
                key.heldFor = 0;
            }
        }

        let left = this.keys.get(Key.ArrowLeft)!;
        if (!left.pressed) {
            left = this.keys.get(MyKey.A)!;
        }
        let right = this.keys.get(Key.ArrowRight)!;
        if (!right.pressed) {
            right = this.keys.get(MyKey.D)!;
        }
        if (left.pressed && right.pressed) {
            this.car.speedX = 0;
        } else {
            const directionHeldFor = (left.pressed ? left.heldFor : (right.pressed ? right.heldFor : 0));
            const directionMultiplier = (left.pressed ? -1 : (right.pressed ? 1 : 0)) * (directionHeldFor * this.car.accelerationX + 1);
            this.car.speedX = directionMultiplier * this.car.initialSpeedX;
        }
        this.car.X += this.car.speedX * this.logicPerSecondScaleFactor * this.rowsPerSecondScaleFactor;

        let up = this.keys.get(Key.ArrowUp)!;
        if (!up.pressed) {
            up = this.keys.get(MyKey.W)!;
        }
        let down = this.keys.get(Key.ArrowDown)!;
        if (!down.pressed) {
            down = this.keys.get(MyKey.S)!;
        }
        if (up.pressed && down.pressed) {
            this.car.speedY = 0;
        } else {
            const directionHeldFor = (up.pressed ? up.heldFor : (down.pressed ? down.heldFor : 0));
            const directionMultiplier = (up.pressed ? 1 : (down.pressed ? -1 : 0)) * (directionHeldFor * this.car.accelerationY + 1);
            this.car.speedY = directionMultiplier * this.car.initialSpeedY;
        }
        this.car.Y += this.car.speedY * this.logicPerSecondScaleFactor;
        const carOverScreenTop = this.car.Y + this.car.height - this.HEIGHT;
        if (carOverScreenTop > 0) {
            this.car.Y -= carOverScreenTop;
        }
        if (this.car.Y < 0) {
            this.car.Y = 0;
        }

        // Scroll road
        this.screenBottom += this.rowsPerSecond / GameBrain.LOGIC_PER_SECOND;
    
        // Generate more road if needed
        let requiredRowsToGenerate = Math.ceil(this.screenTop - this.roadGenerator.generatedUpToCoordinate);
        if (requiredRowsToGenerate > 0) {
            this.roadGenerator.generateRows(requiredRowsToGenerate + 10);
            this.roadGenerator.clearRowsBelow(this.screenBottom - 10);
        }

        for (const row of this.roadGenerator.road.values()) {
            if (row.positionY - this.screenBottom <= this.car.Y && row.stageChange && this.stageLabel !== row.stageChange.label) {
                this.stageChanges++;
                this.stageLabel = row.stageChange.label;
                const level = Math.floor(this.stageChanges / GameStages.size);
                if (level > this.previousSpeedIncreaseAtLevel) {
                    this.previousSpeedIncreaseAtLevel = level;
                    this.rowsPerSecond += this.SPEED_INCREASE_AT_LEVEL_LOOP;
                }
                this.HUD.updateStageInfo();
            }
            if (row.positionY - this.screenBottom >= this.car.Y && row.positionY - this.screenBottom + row.height <= this.car.Y + this.car.height) {
                if (this.car.X - this.car.width / 2 <= row.positionX - row.width / 2 || this.car.X + this.car.width / 2 >= row.positionX + row.width / 2) {
                    this.dealDamage();
                    if (this.health > 0) {
                        this.car.X = row.positionX;
                    }
                    break;
                }
            }
            if (row.positionY - this.screenBottom <= this.car.Y + this.car.height) {
                for (const placedObstacle of row.obstacles) {
                    if (row.positionY - this.screenBottom + placedObstacle.obstacle.height >= this.car.Y) {
                        const obstaclePositionX = placedObstacle.positionX + row.positionX;
                        const carRight = this.car.X + this.car.width / 2;
                        const carLeft = this.car.X - this.car.width / 2;
                        const obstacleRight = obstaclePositionX + placedObstacle.obstacle.width / 2;
                        const obstacleLeft = obstaclePositionX - placedObstacle.obstacle.width / 2;
                        if (carRight > obstacleLeft && carLeft < obstacleRight) {
                            this.dealDamage();
                            break;
                        }
                    }
                }
            }
        }

        this.scoreMultiplier = (this.car.Y ** this.SCORE_MULTIPLIER_EXPONENT) / ((this.HEIGHT - this.car.height) ** this.SCORE_MULTIPLIER_EXPONENT) * (this.SCORE_MULTIPLIER_AT_SCREEN_TOP - 1) + 1;
        this.score += (this.BASE_SCORE_PER_ROW * this.scoreMultiplier) * this.rowsPerSecond / GameBrain.LOGIC_PER_SECOND;
        this.HUD.updateScoreInfo();

        if (this.invincibleForSeconds > 0) {
            this.invincibleForSeconds = Math.max(this.invincibleForSeconds - 1 / GameBrain.LOGIC_PER_SECOND, 0);
        }

        if (this.health <= 0) {
            this.loadEndScreen();
        }
    }

    advanceLogic = () => {
        this._advanceLogic();
    }

    loadEndScreen() {
        this.pauseMenu?.deactivate();
        this.pause();
        const endScreen = new EndScreen(this);
    }

    dealDamage() {
        if (this.invincibleForSeconds <= 0) {
            this.health--;
            this.invincibleForSeconds = 2;
            this._render();
            this.HUD.updateHp();
        }
    }

    setFps(framesPerSecond: number) {
        this._fpsIntervalId = this.setInterval(framesPerSecond, this.render, this._fpsIntervalId);
    }

    setLogicInterval(checksPerSecond: number) {
        this._logicIntervalId = this.setInterval(checksPerSecond, this.advanceLogic, this._logicIntervalId);
    }

    setInterval(frequencyPerSecond: number, callbackFunction: () => void, intervalId: number | null = null) {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }

        if (frequencyPerSecond > 0) {
            intervalId = window.setInterval(callbackFunction, 1000 / frequencyPerSecond);
        }

        return intervalId;
    }

    pause() {
        this.paused = true;
        this.setFps(0);
        this.setLogicInterval(0);
    }

    unPause() {
        this.paused = false;
        this.setFps(this.racingGame.options.fps);
        this.setLogicInterval(GameBrain.LOGIC_PER_SECOND);
    }

    _onResize(this: GameBrain) {
        const gameHeightPx = window.innerHeight - this.hudHeight / this.scale;
        const widthPx = window.innerWidth;
        const desiredWidthPx = gameHeightPx * (GameBrain.MAX_ROAD_WIDTH + 10) / this.HEIGHT;
        if (desiredWidthPx > widthPx) {
            const desiredGameHeightPx = gameHeightPx * widthPx / desiredWidthPx;
            this.hudHeight = (window.innerHeight - desiredGameHeightPx) / this.scale;
        } else {
            this.hudHeight = GameBrain.MIN_HUD_HEIGHT;
        }
        this.HUD.onResize();
        this._render();
    }

    onResize = () => {
        this._onResize();
    }
}

