import { GameBrain } from "./game_brain.js";
import { MainMenu } from "./main_menu.js";
import { Options } from "./options.js";
import { Score } from "./score.js";


export class RacingGame {
    constructor() {
        this.app = document.getElementById("app");
        this.LOCAL_STORAGE_KEY = "icd0006_racing_game_mipaat";
        /** @type {Array<Score>} */
        this.scores = this.getScores();

        this.layers = [];
        this.fgLayer = this.createLayer(15);
        this.mainLayer = this.createLayer(10);
        this.bgLayer = this.createLayer(5);
        this.roadLayer = this.createLayer(6);
        this.obstacleLayer = this.createLayer(7);
        this.HUDLayer = this.createLayer(18);
        this.blockingMenuLayer = this.createLayer(20);

        this.options = new Options(30);
    }

    run() {
        this.loadMainMenu();
    }

    start() {
        this.mainMenu?.deactivate();
        this.mainMenu = null;
        this.brain = new GameBrain(this);
    }

    loadMainMenu() {
        this.closeGame();
        this.mainMenu?.deactivate();
        this.mainMenu = new MainMenu(this);
    }

    restart() {
        this.closeGame();
        this.start();
    }

    closeGame() {
        this.brain?.deactivate();
        this.brain = null;
    }

    /**
     * @returns {Array<Score>}
     */
    getScores() {
        const serializedScores = window.localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!serializedScores) {
            return [];
        }
        /** @type {Array<Score>} */
        const scores = JSON.parse(serializedScores);
        scores.sort(Score.comparePoints);
        return scores;
    }

    refreshScores() {
        this.scores = this.getScores();
    }

    clearScores() {
        this.scores = [];
        window.localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }

    /**
     * @param {number} scorePoints 
     */
    saveScore(scorePoints) {
        this.refreshScores();
        this.scores.push(new Score(scorePoints, new Date(Date.now())));
        this.scores.sort(Score.comparePoints);
        window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.scores));
    }

    createLayer(layerHeight) {
        if (!Number.isInteger(layerHeight)) {
            throw new TypeError(`layerHeight mustbe a integer, but was ${typeof(layerHeight)}, value: '${layerHeight}'`);
        }
        let layer = document.createElement("div");
        layer.classList.add("layer");
        layer.style.zIndex = layerHeight;
        this.app.appendChild(layer);
        this.layers.push(layer);
        return layer;
    }

    togglePause() {
        this.blockingMenuLayer.hidden = !this.blockingMenuLayer.hidden;
    }
}
