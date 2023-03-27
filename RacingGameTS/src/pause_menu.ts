import { Key } from "ts-key-enum";
import { EventType } from "./enums/event_type";
import { GameBrain } from "./game_brain";
import { RacingGame } from "./racing_game";
import { removeAllChildNodes } from "./utils";



export class PauseMenu {
    private get racingGame(): RacingGame {
        return this.gameBrain.racingGame;
    }

    private pauseMenu!: HTMLDivElement;

    constructor(private readonly gameBrain: GameBrain) {
        this.createPauseMenu();  // This MUST assign a value to this.pauseMenu

        window.addEventListener(EventType.KeyUp, this.handleKeyPress);
        this.pauseMenu.hidden = true;
    }

    onResize = () => this.gameBrain._render();

    _handleKeyPress(this: PauseMenu, event: KeyboardEvent) {
        if (event.key === Key.Escape) {
            this.togglePause();
        }
    }

    handleKeyPress = (event: KeyboardEvent) => this._handleKeyPress(event);

    createPauseMenu() {
        const pauseMenu = document.createElement("div");

        pauseMenu.style.background = "#000";
        pauseMenu.classList.add("overlay-blocking-menu");

        const titleDiv = document.createElement("div");
        pauseMenu.appendChild(titleDiv);
        titleDiv.innerText = "PAUSED";
        titleDiv.classList.add("text-medium");

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("menu-section");
        const resumeButton = document.createElement("button");
        resumeButton.classList.add("menu-item");
        resumeButton.innerText = "Resume";
        resumeButton.addEventListener(EventType.Click, () => {this.unpause()});
        optionsDiv.appendChild(resumeButton);
        const mainMenuButton = document.createElement("button");
        mainMenuButton.classList.add("menu-item");
        mainMenuButton.innerText = "Main Menu";
        mainMenuButton.addEventListener(EventType.Click, () => {
            this.racingGame.saveScore(this.gameBrain.score);
            this.racingGame.loadMainMenu();
        });
        optionsDiv.appendChild(mainMenuButton);
        pauseMenu.appendChild(optionsDiv);

        this.pauseMenu = pauseMenu;
        this.racingGame.blockingMenuLayer.appendChild(this.pauseMenu);
    }

    deactivate() {
        window.removeEventListener(EventType.KeyUp, this.handleKeyPress);
        removeAllChildNodes(this.racingGame.blockingMenuLayer);
    }

    togglePause() {
        this.gameBrain.paused ? this.unpause() : this.pause();
    }

    pause() {
        this.pauseMenu.hidden = false;
        this.gameBrain.pause();
    }

    unpause() {
        this.pauseMenu.hidden = true;
        this.gameBrain.unPause();
    }
}
