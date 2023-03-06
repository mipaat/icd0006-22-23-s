import { EventType } from "./enums/event_type.js";
import { RacingGame } from "./racing_game.js";
import { RoadGenerator } from "./road_generator.js";
import { PauseMenu } from "./pause_menu.js";
import { removeAllChildNodes } from "./utils.js";
import { Key } from "./enums/key.js";

export class GameBrain {
    /**
     * @param {RacingGame} racingGame
     */
    constructor(racingGame) {
        const self = this;
        this.render = () => this._render(self);
        this.advanceLogic = () => this._advanceLogic(self);

        this.HEIGHT = 50;
        this.MIN_HEIGHT_PX = 200;

        this.LOGIC_PER_SECOND = 30;

        this.setLogicInterval(this.LOGIC_PER_SECOND);

        this.setFps(racingGame.options.fps);

        this.rowsPerSecond = 40;

        this.racingGame = racingGame;
        this.app = racingGame.app;
        this.paused = false;
        this.pauseMenu = new PauseMenu(this);

        this.handleKeyDown = (event) => this._handleKeyDown(self, event);
        this.handleKeyDown.eventType = EventType.KeyDown;
        this.handleKeyUp = (event) => this._handleKeyUp(self, event);
        this.handleKeyUp.eventType = EventType.KeyUp;

        this.ACCELERATION_PER_PRESS = 0.1;
        this.carY = 5;
        this.carX = 0;
        this.carWidth = 10;
        this.carHeight = 7;
        this.carXSpeed = 0;
        this.carXAcceleration = 0;
        this.racingGame.app.addEventListener(this.handleKeyDown.eventType, this.handleKeyDown);
        this.racingGame.app.addEventListener(this.handleKeyUp.eventType, this.handleKeyUp);

        this.roadGenerator = new RoadGenerator(70);
        this.roadGenerator.generateRows(Math.ceil(this.HEIGHT));

        this.screenBottom = 0;
    }

    _handleKeyDown(self, event) {
        if (event.keyCode === Key.ArrowLeft) {
            self.carXAcceleration = Math.max(self.carXAcceleration - self.ACCELERATION_PER_PRESS, -self.ACCELERATION_PER_PRESS);
        }
        if (event.keyCode === Key.ArrowRight) {
            self.carXAcceleration = Math.min(self.carXAcceleration + self.ACCELERATION_PER_PRESS, self.ACCELERATION_PER_PRESS);
        }
    }

    _handleKeyUp(self, event) {
        if (event.keyCode === Key.ArrowLeft) {
            self.carXAcceleration = Math.min(self.carXAcceleration + self.ACCELERATION_PER_PRESS, 0);
        } else if (event.keyCode === Key.ArrowRight) {
            self.carXAcceleration = Math.max(self.carXAcceleration - self.ACCELERATION_PER_PRESS, 0);
        }
    }

    deactivate() {
        this.racingGame.app.removeEventListener(this.handleKeyDown.eventType, this.handleKeyDown);
        this.racingGame.app.removeEventListener(this.handleKeyUp.eventType, this.handleKeyUp);
        this.pauseMenu.deactivate();
    }

    get screenTop() {
        return this.screenBottom + this.HEIGHT;
    }

    vhValue(value) {
        const vhMultiplier = 100 / this.HEIGHT;
        return `${vhMultiplier * value}vh`;
    }

    /**
     * @param {GameBrain} self 
     */
    _render(self) {
        removeAllChildNodes(self.racingGame.bgLayer);
        removeAllChildNodes(self.racingGame.bgLayer2);
        removeAllChildNodes(self.racingGame.mainLayer);
        const scale = window.innerHeight / self.HEIGHT;
        const vhMultiplier = 100 / this.HEIGHT;
        const children = [];

        for (const entry of this.roadGenerator.road.entries()) {
            const height = entry[0];
            if (height > self.screenTop || height < self.screenBottom) continue;

            const roadSlice = entry[1];

            const groundElement = document.createElement("div");
            groundElement.style.height = this.vhValue(roadSlice.height);
            groundElement.style.width = "100%";
            groundElement.style.background = roadSlice.groundType.color;
            groundElement.innerText = height;

            const roadElement = document.createElement("div");
            roadElement.style.height = this.vhValue(roadSlice.height);
            roadElement.style.width = this.vhValue(roadSlice.width);
            roadElement.style.background = roadSlice.roadType.color;
            roadElement.style.position = "relative";
            roadElement.style.left = `${window.innerWidth / 2 - (roadSlice.width / 2) * scale + roadSlice.position * scale}px`;

            children.push({groundElement, roadElement});
        }
        for (const element of children.reverse()) {
            self.racingGame.bgLayer.appendChild(element.groundElement);
            self.racingGame.bgLayer2.appendChild(element.roadElement);
        }

        const carElement = document.createElement("div");
        carElement.style.height = this.vhValue(this.carHeight);
        carElement.style.width = this.vhValue(this.carWidth);
        carElement.style.background = "#F00";
        carElement.style.position = "absolute";
        carElement.style.left = `${window.innerWidth / 2 - (this.carWidth / 2) * scale + this.carX * scale}px`;
        carElement.style.top = this.vhValue(this.HEIGHT - (this.carY + this.carHeight));
        self.racingGame.mainLayer.appendChild(carElement);
    }

    /**
     * @param {GameBrain} self 
     */
    _advanceLogic(self) {
        const maxCarXSpeed = 10;
        this.carXSpeed = Math.min(Math.max(this.carXSpeed + this.carXAcceleration, -maxCarXSpeed), maxCarXSpeed);
        this.carX += this.carXSpeed;

        // Scroll road
        self.screenBottom += self.rowsPerSecond / self.LOGIC_PER_SECOND;
    
        // Generate more road if needed
        let requiredRowsToGenerate = Math.ceil(self.screenTop - self.roadGenerator.generatedUpToCoordinate);
        if (requiredRowsToGenerate > 0) {
            self.roadGenerator.generateRows(requiredRowsToGenerate);
            self.roadGenerator.clearRowsBelow(this.screenBottom);
        }

        // TODO: Check collisions
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
}