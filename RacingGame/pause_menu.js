import { EventType } from "./enums/event_type.js";
import { Key } from "./enums/key.js";
import { GameBrain } from "./game_brain.js";
import { RacingGame } from "./racing_game.js";
import { removeAllChildNodes } from "./utils.js";



export class PauseMenu {
    /**
     * @param {GameBrain} gameBrain 
     */
    constructor(gameBrain) {
        this.gameBrain = gameBrain;
        /**
         * @type {RacingGame}
         */
        this.racingGame = gameBrain.racingGame;

        this.createPauseMenu();

        this.onResize = () => gameBrain.render();

        /**
         * @type {PauseMenu}
         */
        const self = this;

        function handleKeypress(event) {
            if (event.keyCode === Key.Esc) {
                self.togglePause();
            };
        };
        handleKeypress.eventType = EventType.KeyUp;
        this.eventListeners = [
            handleKeypress,
        ];
        this.racingGame.app.addEventListener(handleKeypress.eventType, handleKeypress);
        this.pauseMenu.hidden = true;
    }

    createPauseMenu() {
        const self = this;

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
        resumeButton.addEventListener(EventType.Click, () => {self.unpause()});
        optionsDiv.appendChild(resumeButton);
        const mainMenuButton = document.createElement("button");
        mainMenuButton.classList.add("menu-item");
        mainMenuButton.innerText = "Main Menu";
        mainMenuButton.addEventListener(EventType.Click, () => {
            self.racingGame.saveScore(this.gameBrain.score);
            self.racingGame.loadMainMenu();
        });
        optionsDiv.appendChild(mainMenuButton);
        pauseMenu.appendChild(optionsDiv);

        this.pauseMenu = pauseMenu;
        this.racingGame.blockingMenuLayer.appendChild(this.pauseMenu);
    }

    deactivate() {
        if (this.eventListeners) {
            this.eventListeners.forEach(listener => {
                this.racingGame.app.removeEventListener(listener.eventType, listener);
            });
        }
        removeAllChildNodes(this.racingGame.blockingMenuLayer);
        this.racingGame.pauseMenu = null;
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
