import { GameBrain } from "./game_brain.js";
import { MainMenu } from "./main_menu.js";
import { Options } from "./options.js";


export class RacingGame {
    constructor() {
        this.app = document.getElementById("app");

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
        this.mainMenu.deactivate();
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
