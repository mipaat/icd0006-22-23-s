import { EventType } from "./enums/event_type.js";
import { Key } from "./enums/key.js";
import { centerVertically, centerHorizontally } from "./utils.js";



export class PauseMenu {
    constructor(gameBrain) {
        this.gameBrain = gameBrain;
        this.racingGame = gameBrain.racingGame;

        this.createPauseMenu();

        const self = this;

        function handleKeypress(event) {
            if (event.keyCode === Key.Esc) {
                self.togglePause();
            };
            // TODO: keyboard menu navigation?
        };
        handleKeypress.listenerType = EventType.KeyUp;
        this.eventListeners = [
            handleKeypress,
        ];
        this.racingGame.app.addEventListener(handleKeypress.listenerType, handleKeypress);
        this.pauseMenu.hidden = true;
    }

    createPauseMenu() {
        let pauseMenu = document.createElement("div");

        pauseMenu.style.background = "#000";
        pauseMenu.style.width = "25em";
        pauseMenu.style.height = "30em";
        pauseMenu.style.padding = "3em";
        centerVertically(pauseMenu);
        centerHorizontally(pauseMenu);

        let titleDiv = document.createElement("div");
        titleDiv.innerText = "PAUSED";
        titleDiv.style.color = "white";
        titleDiv.style.fontSize = "2em";
        pauseMenu.appendChild(titleDiv);

        this.pauseMenu = pauseMenu;
        this.racingGame.blockingMenuLayer.appendChild(this.pauseMenu);

        const self = this;
        function onResize(event) {
            self.pause();
            // TODO: disallow unpausing for too thin aspect ratios and too low vertical resolutions
        }
        onResize.eventType = EventType.Resize;
        window.addEventListener(onResize.eventType, onResize);
    }

    deactivate() {
        if (this.eventListeners) {
            this.eventListeners.forEach(listener => {
                this.racingGame.app.removeEventListener(listener.listenerType, listener);
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
    }

    unpause() {
        this.pauseMenu.hidden = true;
        this.gameBrain.unPause();
    }
}
