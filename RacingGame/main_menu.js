import { EventType } from "./enums/event_type.js";
import { RacingGame } from "./racing_game.js";

export class MainMenu {
    /**
     * @param {RacingGame} racingGame 
     */
    constructor(racingGame) {
        this.racingGame = racingGame;

        let mainMenu = document.createElement("div");

        let titleDiv = document.createElement("div");
        titleDiv.innerText = "MAIN MENU";
        titleDiv.style.color = "white";
        titleDiv.style.fontSize = "4em";
        mainMenu.appendChild(titleDiv);

        let buttonsDiv = document.createElement("div");
        let startButton = document.createElement("button");
        startButton.innerText = "START";
        startButton.addEventListener(EventType.Click, (event) => {
            this.racingGame.start();
            event.preventDefault();
        });
        buttonsDiv.appendChild(startButton);
        mainMenu.appendChild(buttonsDiv);

        this.mainMenu = mainMenu;
        this.racingGame.blockingMenuLayer.appendChild(mainMenu);
    }

    deactivate() {
        this.mainMenu.parentElement.removeChild(this.mainMenu);
    }
}
