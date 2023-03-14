import { EventType } from "./enums/event_type.js";
import { Key } from "./enums/key.js";
import { GameBrain } from "./game_brain.js";
import { RacingGame } from "./racing_game.js";
import { centerVertically, centerHorizontally } from "./utils.js";



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

    /**
     * 
     * @param {GameBrain} gameBrain 
     */
    _onResize(gameBrain) {
        gameBrain.render();
    }

    createPauseMenu() {
        const self = this;

        let pauseMenu = document.createElement("div");

        pauseMenu.style.background = "#000";
        pauseMenu.style.maxWidth = "25em";
        pauseMenu.style.width = "fit-content";
        pauseMenu.style.maxHeight = "30em";
        pauseMenu.style.padding = "3em";
        centerVertically(pauseMenu);
        centerHorizontally(pauseMenu);

        let titleDiv = document.createElement("div");
        titleDiv.innerText = "PAUSED";
        titleDiv.style.color = "white";
        titleDiv.style.fontSize = "5vh";
        pauseMenu.appendChild(titleDiv);

        let optionsDiv = document.createElement("div");
        optionsDiv.classList.add("menuSection");
        let resumeButton = document.createElement("button");
        resumeButton.classList.add("menuItem");
        resumeButton.innerText = "Resume";
        resumeButton.addEventListener(EventType.Click, () => {self.unpause()});
        optionsDiv.appendChild(resumeButton);
        let mainMenuButton = document.createElement("button");
        mainMenuButton.classList.add("menuItem");
        mainMenuButton.innerText = "Main Menu";
        mainMenuButton.addEventListener(EventType.Click, () => {self.racingGame.loadMainMenu()});
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
        this.pauseMenu.parentElement.removeChild(this.pauseMenu);
        this.racingGame.pauseMenu = null;
    }

    togglePause() {
        this.gameBrain.paused ? this.unpause() : this.pause();
    }

    pause() {
        this.pauseMenu.hidden = false;
        this.gameBrain.pause();
        window.addEventListener(EventType.Resize, this.onResize);
    }

    unpause() {
        this.racingGame.app.removeEventListener(EventType.Resize, this.onResize);
        this.pauseMenu.hidden = true;
        this.gameBrain.unPause();
    }
}
