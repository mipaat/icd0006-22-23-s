import { EventType } from "./enums/event_type.js";
import { RacingGame } from "./racing_game.js";
import { removeAllChildNodes } from "./utils.js";

export class MainMenu {
    /**
     * @param {RacingGame} racingGame 
     */
    constructor(racingGame) {
        this.racingGame = racingGame;

        const mainMenu = document.createElement("div");
        this.mainMenu = mainMenu;
        this.racingGame.blockingMenuLayer.appendChild(mainMenu);
        mainMenu.style.width = "100%";
        mainMenu.style.height = "100%";
        mainMenu.style.background = "black";
        mainMenu.style.color = "white";
        mainMenu.style.position = "absolute";

        const titleAndStartContainer = document.createElement("div");
        mainMenu.appendChild(titleAndStartContainer);
        titleAndStartContainer.style.marginTop = "6vh";

        const titleDiv = document.createElement("div");
        titleAndStartContainer.appendChild(titleDiv);
        titleDiv.innerText = "RacingGame";
        titleDiv.style.textAlign = "center";
        titleDiv.classList.add("text-large");

        const startButton = document.createElement("button");
        titleAndStartContainer.appendChild(startButton);
        startButton.innerText = "START";
        startButton.classList.add("text-large");
        startButton.style.position = "relative";
        startButton.style.left = "50%";
        startButton.style.transform = "translateX(-50%)";
        startButton.addEventListener(EventType.Click, (event) => {
            this.racingGame.start();
            event.preventDefault();
        });

        const infoSectionsContainer = document.createElement("div");
        mainMenu.appendChild(infoSectionsContainer);
        infoSectionsContainer.classList.add("main-menu-sections-container");

        const controlsContainer = document.createElement("div");
        infoSectionsContainer.appendChild(controlsContainer);
        const controlsTitle = document.createElement("div");
        controlsContainer.appendChild(controlsTitle);
        controlsTitle.innerText = "CONTROLS";
        controlsTitle.classList.add("text-medium");
        const controlsElement = document.createElement("div");
        controlsContainer.appendChild(controlsElement);
        controlsElement.classList.add("text-normal");
        const controlsList = ["Move left: Left Arrow", "Move right: Right Arrow", "Pause/Unpause: Escape"];
        for (const control of controlsList) {
            const controlElement = document.createElement("div");
            controlsElement.appendChild(controlElement);
            controlElement.innerText = control;
        }

        const scoresContainer = document.createElement("div");
        infoSectionsContainer.appendChild(scoresContainer);
        const scoresTitle = document.createElement("div");
        scoresContainer.appendChild(scoresTitle);
        scoresTitle.innerText = "HIGH SCORES";
        scoresTitle.classList.add("text-medium");
        const scoresElement = document.createElement("div");
        scoresContainer.appendChild(scoresElement);
        scoresContainer.classList.add("text-normal");
        scoresElement.style.maxHeight = "30vh";
        scoresElement.style.overflow = "auto";
        this.scoresElement = scoresElement;
        this.updateScoresElement();
        const clearScoreButton = document.createElement("button");
        scoresContainer.appendChild(clearScoreButton);
        clearScoreButton.innerText = "CLEAR SCORES";
        clearScoreButton.classList.add("text-normal");
        clearScoreButton.addEventListener(EventType.Click, (event) => {
            this.racingGame.clearScores();
            this.updateScoresElement();
            event.preventDefault();
        });
    }

    updateScoresElement() {
        removeAllChildNodes(this.scoresElement);
        for (const score of this.racingGame.scores) {
            const scoreElement = document.createElement("div");
            this.scoresElement.appendChild(scoreElement);
            scoreElement.innerText = `${Math.round(score.points)} at ${new Date(score.setAt).toLocaleString()}`;
        }
    }

    deactivate() {
        this.mainMenu.parentElement.removeChild(this.mainMenu);
    }
}
