import { EventType } from "./enums/event_type.js";
import { RacingGame } from "./racing_game.js";
import { RoadGenerator } from "./road_generator.js";
import { PauseMenu } from "./pause_menu.js";
import { removeAllChildNodes } from "./utils.js";

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

        this.roadGenerator = new RoadGenerator(70);
        this.roadGenerator.generateRows(Math.ceil(this.HEIGHT));

        this.screenBottom = 0;
    }

    get screenTop() {
        return this.screenBottom + this.HEIGHT;
    }

    /**
     * @param {GameBrain} self 
     */
    _render(self) {
        removeAllChildNodes(self.racingGame.bgLayer);
        removeAllChildNodes(self.racingGame.bgLayer2);
        const scale = window.innerHeight / self.HEIGHT;
        const vhMultiplier = 100 / this.HEIGHT;
        const children = [];

        for (const entry of this.roadGenerator.road.entries()) {
            const height = entry[0];
            if (height > self.screenTop || height < self.screenBottom) continue;

            const roadSlice = entry[1];

            const groundElement = document.createElement("div");
            groundElement.style.height = `${vhMultiplier * roadSlice.height}vh`;
            groundElement.style.width = "100%";
            groundElement.style.background = roadSlice.groundType.color;
            groundElement.innerText = height;

            const roadElement = document.createElement("div");
            roadElement.style.height = `${vhMultiplier * roadSlice.height}vh`;
            roadElement.style.width = `${vhMultiplier * roadSlice.width}vh`;
            roadElement.style.background = roadSlice.roadType.color;
            roadElement.style.position = "relative";
            roadElement.style.left = `${window.innerWidth / 2 - (roadSlice.width / 2) * scale + roadSlice.position * scale}px`;

            children.push({groundElement, roadElement});
        }
        for (const element of children.reverse()) {
            self.racingGame.bgLayer.appendChild(element.groundElement);
            self.racingGame.bgLayer2.appendChild(element.roadElement);
        }
    }

    /**
     * @param {GameBrain} self 
     */
    _advanceLogic(self) {
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