import { EventType } from "./enums/event_type.js";
import { RacingGame } from "./racing_game.js";
import { RoadGenerator } from "./road_generator.js";
import { PauseMenu } from "./pause_menu.js";
import { removeAllChildNodes } from "./utils.js";
import { Key } from "./enums/key.js";
import { Car } from "./car.js";
import { GameStages } from "./game_stage.js";
import { HUD } from "./hud.js";
import { EndScreen } from "./end_screen.js";

export class GameBrain {
    /**
     * @param {RacingGame} racingGame
     */
    constructor(racingGame) {
        const self = this;
        this.render = () => this._render(self);
        this.advanceLogic = () => this._advanceLogic(self);
        this.onResize = () => this._onResize(self);

        this.HEIGHT = 50;
        this.MIN_HUD_HEIGHT = 8;
        this.hudHeight = this.MIN_HUD_HEIGHT;
        this.MIN_HEIGHT_PX = 200;
        this.MAX_ROAD_WIDTH = 40;

        this.LOGIC_PER_SECOND = 30;

        this.rowsPerSecond = 50;

        this.racingGame = racingGame;
        this.app = racingGame.app;
        this.unPause()
        this.pauseMenu = new PauseMenu(this);

        window.addEventListener(EventType.Resize, this.onResize);

        this.handleKeyDown = (event) => this._handleKeyDown(self, event);
        this.handleKeyDown.eventType = EventType.KeyDown;
        this.handleKeyUp = (event) => this._handleKeyUp(self, event);
        this.handleKeyUp.eventType = EventType.KeyUp;
        /** @type {Map<number, KeyStatus>} */
        this.keys = new Map();
        this.registerKeys(Key.ArrowLeft, Key.ArrowRight, Key.ArrowDown, Key.ArrowUp, Key.W, Key.A, Key.S, Key.D);
        this.racingGame.app.addEventListener(this.handleKeyDown.eventType, this.handleKeyDown);
        this.racingGame.app.addEventListener(this.handleKeyUp.eventType, this.handleKeyUp);

        this.car = new Car();

        this.health = 3;
        this.invincibleForSeconds = 0;

        this.roadGenerator = new RoadGenerator(this.MAX_ROAD_WIDTH);
        this.stageLabel = this.roadGenerator.stage.label;
        this.roadGenerator.generateRows(Math.ceil(this.HEIGHT));

        this.screenBottom = 0;

        this.stageChanges = 0;
        this.previousSpeedIncreaseAtLevel = 0;

        this.score = 0;
        this.BASE_SCORE_PER_ROW = 1;
        this.scoreMultiplier = 1;
        this.SCORE_MULTIPLIER_EXPONENT = 2.5;
        this.SCORE_MULTIPLIER_AT_SCREEN_TOP = 4;

        this.SPEED_INCREASE_AT_LEVEL_LOOP = 10;

        this.HUD = new HUD(this, 8);
        this.onResize();
    }

    /**
     * @param {Array<number>} keyCodes
     */
    registerKeys(...keyCodes) {
        for (const keyCode of keyCodes) {
            if (!this.keys.has(keyCode)) {
                this.keys.set(keyCode, new KeyStatus());
            }
        }
    }

    _handleKeyDown(self, event) {
        const keyStatus = self.keys.get(event.keyCode);
        if (keyStatus) {
            keyStatus.pressed = true;
        }
    }

    _handleKeyUp(self, event) {
        const keyStatus = self.keys.get(event.keyCode);
        if (keyStatus) {
            keyStatus.pressed = false;
        }
    }

    deactivate() {
        this.racingGame.app.removeEventListener(this.handleKeyDown.eventType, this.handleKeyDown);
        this.racingGame.app.removeEventListener(this.handleKeyUp.eventType, this.handleKeyUp);
        this.racingGame.app.removeEventListener(EventType.Resize, this.onResize);
        removeAllChildNodes(this.racingGame.bgLayer);
        removeAllChildNodes(this.racingGame.roadLayer);
        removeAllChildNodes(this.racingGame.mainLayer);
        removeAllChildNodes(this.racingGame.obstacleLayer);
        this.setFps(0);
        this.setLogicInterval(0);
        this.pauseMenu.deactivate();
        this.HUD.deactivate();
    }

    get screenTop() {
        return this.screenBottom + this.HEIGHT;
    }

    vhValue(value) {
        const vhMultiplier = 100 / (this.HEIGHT + this.hudHeight);
        return `${vhMultiplier * value}vh`;
    }

    get scale() {
        return window.innerHeight / (this.HEIGHT + this.hudHeight);
    }

    /**
     * @param {GameBrain} self 
     */
    _render(self) {
        removeAllChildNodes(self.racingGame.bgLayer);
        removeAllChildNodes(self.racingGame.roadLayer);
        removeAllChildNodes(self.racingGame.mainLayer);
        removeAllChildNodes(self.racingGame.obstacleLayer);
        const children = [];

        const emptyHUDBg = document.createElement("div");
        emptyHUDBg.style.height = this.vhValue(this.hudHeight);
        this.racingGame.bgLayer.appendChild(emptyHUDBg);
        const emptyHUDRoad = document.createElement("div");
        emptyHUDRoad.style.height = this.vhValue(this.hudHeight);
        this.racingGame.roadLayer.appendChild(emptyHUDRoad);

        for (const entry of self.roadGenerator.road.entries()) {
            const coordinateY = entry[0];
            const roadSlice = entry[1];

            if (coordinateY > self.screenTop) continue;
            if (coordinateY + roadSlice.height < self.screenBottom) {
                if (coordinateY + roadSlice.getMaxHeight() < self.screenBottom) {
                    continue;
                }
            }

            const groundElement = document.createElement("div");
            groundElement.style.height = self.vhValue(roadSlice.height);
            groundElement.style.width = "100%";
            groundElement.style.background = roadSlice.groundType.color;
            groundElement.style.fontSize = self.vhValue(roadSlice.height * 0.7);

            const roadElement = document.createElement("div");
            roadElement.style.height = self.vhValue(roadSlice.height);
            roadElement.style.width = self.vhValue(roadSlice.width);
            roadElement.style.background = roadSlice.roadType.color;
            roadElement.style.position = "relative";
            const roadSliceCenterPx = window.innerWidth / 2 + roadSlice.positionX * self.scale;
            roadElement.style.left = `${roadSliceCenterPx - (roadSlice.width / 2) * self.scale}px`;

            for (const placedObstacle of roadSlice.obstacles) {
                const obstacleElement = document.createElement("div");
                obstacleElement.style.height = self.vhValue(placedObstacle.obstacle.height);
                obstacleElement.style.width = self.vhValue(placedObstacle.obstacle.width);
                obstacleElement.style.background = placedObstacle.obstacle.color;
                obstacleElement.style.position = "absolute";
                obstacleElement.style.left = `${roadSliceCenterPx + placedObstacle.positionX * self.scale - placedObstacle.obstacle.width / 2 * self.scale}px`;
                obstacleElement.style.top = `${window.innerHeight - (roadSlice.positionY - self.screenBottom + placedObstacle.obstacle.height) * self.scale}px`;

                self.racingGame.obstacleLayer.appendChild(obstacleElement);
            }

            children.push({groundElement, roadElement});
        }
        for (const element of children.reverse()) {
            self.racingGame.bgLayer.appendChild(element.groundElement);
            self.racingGame.roadLayer.appendChild(element.roadElement);
        }

        const carElement = document.createElement("div");
        carElement.style.height = self.vhValue(self.car.height);
        carElement.style.width = self.vhValue(self.car.width);
        carElement.style.background = "#F00";
        carElement.style.opacity = self.invincibleForSeconds <= 0 ? "1" : "0.5";
        carElement.style.position = "absolute";
        carElement.style.left = `${window.innerWidth / 2 - (self.car.width / 2) * self.scale + self.car.X * self.scale}px`;
        carElement.style.top = self.vhValue(self.HEIGHT + self.hudHeight - (self.car.Y + self.car.height));
        self.racingGame.mainLayer.appendChild(carElement);
    }

    get rowsPerSecondScaleFactor() {
        return this.rowsPerSecond / 40;
    }

    get logicPerSecondScaleFactor() { // Might be wrong, but seems fine for now?
        return 30 / this.LOGIC_PER_SECOND;
    }

    /**
     * @param {GameBrain} self 
     */
    _advanceLogic(self) {
        for (const key of self.keys.values()) {
            if (key.pressed) {
                key.heldFor++;
            } else {
                key.heldFor = 0;
            }
        }

        let left = self.keys.get(Key.ArrowLeft);
        if (!left.pressed) {
            left = self.keys.get(Key.A);
        }
        let right = self.keys.get(Key.ArrowRight);
        if (!right.pressed) {
            right = self.keys.get(Key.D);
        }
        if (left.pressed && right.pressed) {
            self.car.speedX = 0;
        } else {
            const directionHeldFor = (left.pressed ? left.heldFor : (right.pressed ? right.heldFor : 0));
            const directionMultiplier = (left.pressed ? -1 : (right.pressed ? 1 : 0)) * (directionHeldFor * self.car.ACCELERATION_X + 1);
            self.car.speedX = directionMultiplier * self.car.INITIAL_SPEED_X;
        }
        self.car.X += self.car.speedX * self.logicPerSecondScaleFactor * self.rowsPerSecondScaleFactor;

        let up = self.keys.get(Key.ArrowUp);
        if (!up.pressed) {
            up = self.keys.get(Key.W);
        }
        let down = self.keys.get(Key.ArrowDown);
        if (!down.pressed) {
            down = self.keys.get(Key.S);
        }
        if (up.pressed && down.pressed) {
            self.car.speedY = 0;
        } else {
            const directionHeldFor = (up.pressed ? up.heldFor : (down.pressed ? down.heldFor : 0));
            const directionMultiplier = (up.pressed ? 1 : (down.pressed ? -1 : 0)) * (directionHeldFor * self.car.ACCELERATION_Y + 1);
            self.car.speedY = directionMultiplier * self.car.INITIAL_SPEED_Y;
        }
        self.car.Y += self.car.speedY * self.logicPerSecondScaleFactor;
        const carOverScreenTop = self.car.Y + self.car.height - self.HEIGHT;
        if (carOverScreenTop > 0) {
            self.car.Y -= carOverScreenTop;
        }
        if (self.car.Y < 0) {
            self.car.Y = 0;
        }

        // Scroll road
        self.screenBottom += self.rowsPerSecond / self.LOGIC_PER_SECOND;
    
        // Generate more road if needed
        let requiredRowsToGenerate = Math.ceil(self.screenTop - self.roadGenerator.generatedUpToCoordinate);
        if (requiredRowsToGenerate > 0) {
            self.roadGenerator.generateRows(requiredRowsToGenerate + 10);
            self.roadGenerator.clearRowsBelow(this.screenBottom - 10);
        }

        for (const row of self.roadGenerator.road.values()) {
            if (row.positionY - self.screenBottom <= self.car.Y && row.stageChange && self.stageLabel !== row.stageChange.label) {
                self.stageChanges++;
                self.stageLabel = row.stageChange.label;
                const level = Math.floor(self.stageChanges / GameStages.size);
                if (level > self.previousSpeedIncreaseAtLevel) {
                    self.previousSpeedIncreaseAtLevel = level;
                    self.rowsPerSecond += self.SPEED_INCREASE_AT_LEVEL_LOOP;
                }
                self.HUD.updateStageInfo();
            }
            if (row.positionY - self.screenBottom >= self.car.Y && row.positionY - self.screenBottom + row.height <= self.car.Y + self.car.height) {
                if (self.car.X - self.car.width / 2 <= row.positionX - row.width / 2 || self.car.X + self.car.width / 2 >= row.positionX + row.width / 2) {
                    self.dealDamage();
                    if (self.health > 0) {
                        self.car.X = row.positionX;
                    }
                    break;
                }
            }
            if (row.positionY - self.screenBottom <= self.car.Y + self.car.height) {
                for (const placedObstacle of row.obstacles) {
                    if (row.positionY - self.screenBottom + placedObstacle.obstacle.height >= self.car.Y) {
                        const obstaclePositionX = placedObstacle.positionX + row.positionX;
                        const carRight = self.car.X + self.car.width / 2;
                        const carLeft = self.car.X - self.car.width / 2;
                        const obstacleRight = obstaclePositionX + placedObstacle.obstacle.width / 2;
                        const obstacleLeft = obstaclePositionX - placedObstacle.obstacle.width / 2;
                        if (carRight > obstacleLeft && carLeft < obstacleRight) {
                            self.dealDamage();
                            break;
                        }
                    }
                }
            }
        }

        self.scoreMultiplier = (self.car.Y ** self.SCORE_MULTIPLIER_EXPONENT) / ((self.HEIGHT - self.car.height) ** self.SCORE_MULTIPLIER_EXPONENT) * (self.SCORE_MULTIPLIER_AT_SCREEN_TOP - 1) + 1;
        self.score += (self.BASE_SCORE_PER_ROW * self.scoreMultiplier) * self.rowsPerSecond / self.LOGIC_PER_SECOND;
        self.HUD.updateScoreInfo();

        if (self.invincibleForSeconds > 0) {
            self.invincibleForSeconds = Math.max(self.invincibleForSeconds - 1 / self.LOGIC_PER_SECOND, 0);
        }

        if (self.health <= 0) {
            self.loadEndScreen();
        }
    }

    loadEndScreen() {
        this.pauseMenu.deactivate();
        this.pause();
        const endScreen = new EndScreen(this);
    }

    dealDamage() {
        if (this.invincibleForSeconds <= 0) {
            this.health--;
            this.invincibleForSeconds = 2;
            this.render();
            this.HUD.updateHp();
        }
    }

    setFps(framesPerSecond) {
        this._fpsIntervalId = this.setInterval(framesPerSecond, this.render, this._fpsIntervalId);
    }

    setLogicInterval(checksPerSecond) {
        this._logicIntervalId = this.setInterval(checksPerSecond, this.advanceLogic, this._logicIntervalId);
    }

    setInterval(frequencyPerSecond, callbackFunction, intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }

        if (frequencyPerSecond > 0) {
            intervalId = setInterval(callbackFunction, 1000 / frequencyPerSecond);
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
        this.setLogicInterval(this.LOGIC_PER_SECOND);
    }

    /**
     * @param {GameBrain} gameBrain 
     */
    _onResize(gameBrain) {
        const gameHeightPx = window.innerHeight - gameBrain.hudHeight / gameBrain.scale;
        const widthPx = window.innerWidth;
        const desiredWidthPx = gameHeightPx * (gameBrain.MAX_ROAD_WIDTH + 10) / gameBrain.HEIGHT;
        if (desiredWidthPx > widthPx) {
            const desiredGameHeightPx = gameHeightPx * widthPx / desiredWidthPx;
            gameBrain.hudHeight = (window.innerHeight - desiredGameHeightPx) / gameBrain.scale;
        } else {
            gameBrain.hudHeight = gameBrain.MIN_HUD_HEIGHT;
        }
        gameBrain.HUD.onResize();
        gameBrain.render();
    }
}

class KeyStatus {
    /**
     * @param {boolean} pressed 
     * @param {number} heldFor 
     */
    constructor(pressed = false, heldFor = 0) {
        this.pressed = pressed;
        this.heldFor = heldFor;
    }
}