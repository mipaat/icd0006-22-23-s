import { GameBrain } from "./game_brain";
import { MainMenu } from "./main_menu";
import { Options } from "./options";
import { Score } from "./score";


export class RacingGame {
    public readonly app: HTMLElement;
    private static readonly LOCAL_STORAGE_KEY: string = "icd0006_racing_game_mipaat";
    public scores: Array<Score>
    public readonly layers: Array<HTMLDivElement>;

    public readonly fgLayer: HTMLDivElement;
    public readonly mainLayer: HTMLDivElement;
    public readonly bgLayer: HTMLDivElement;
    public readonly roadLayer: HTMLDivElement;
    public readonly obstacleLayer: HTMLDivElement;
    public readonly HUDLayer: HTMLDivElement;
    public readonly blockingMenuLayer: HTMLDivElement;

    public readonly options: Options;

    public brain: GameBrain | null = null;
    public mainMenu: MainMenu | null = null;

    constructor() {
        let app = document.getElementById("app");
        if (app == null) throw new Error("Failed to get 'app' element from DOM");
        this.app = app;
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

    getScores() {
        const serializedScores = window.localStorage.getItem(RacingGame.LOCAL_STORAGE_KEY);
        if (!serializedScores) {
            return [];
        }
        const scores: Array<Score> = JSON.parse(serializedScores);
        scores.sort(Score.comparePoints);
        return scores;
    }

    refreshScores() {
        this.scores = this.getScores();
    }

    clearScores() {
        this.scores = [];
        window.localStorage.removeItem(RacingGame.LOCAL_STORAGE_KEY);
    }

    shortenScores(keepAmount: number) {
        if (this.scores.length > keepAmount) {
            this.scores.splice(keepAmount);
        }
    }

    saveScore(scorePoints: number) {
        this.refreshScores();
        this.scores.push(new Score(scorePoints, new Date(Date.now())));
        this.scores.sort(Score.comparePoints);
        this.shortenScores(40);
        window.localStorage.setItem(RacingGame.LOCAL_STORAGE_KEY, JSON.stringify(this.scores));
    }

    createLayer(layerHeight: number) {
        if (!Number.isInteger(layerHeight)) {
            throw new TypeError(`layerHeight mustbe a integer, but was ${typeof (layerHeight)}, value: '${layerHeight}'`);
        }
        const layer = document.createElement("div");
        layer.classList.add("layer");
        layer.style.zIndex = layerHeight.toString();
        this.app.appendChild(layer);
        this.layers.push(layer);
        return layer;
    }

    togglePause() {
        this.blockingMenuLayer.hidden = !this.blockingMenuLayer.hidden;
    }
}
