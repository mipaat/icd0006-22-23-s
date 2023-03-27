import { EventType } from "./enums/event_type";
import { RacingGame } from "./racing_game";
import { removeAllChildNodes } from "./utils";

export class MainMenu {
    private readonly racingGame: RacingGame;
    private readonly mainMenu: HTMLDivElement;
    private readonly scoresElement: HTMLDivElement;

    constructor(racingGame: RacingGame) {
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
        controlsElement.style.display = "grid";
        controlsElement.style.gridTemplateColumns = "auto auto";
        controlsElement.style.columnGap = "2vh";
        controlsElement.style.rowGap = "0.2vh";
        const controlsMap = new Map([
            ["Move up", "Up Arrow / W"],
            ["Move left", "Left Arrow / A"],
            ["Move down", "Down Arrow / S"],
            ["Move right", "Right Arrow / D"],
            ["Pause/Unpause", "Escape"],
        ]);
        for (const entry of controlsMap.entries()) {
            const controlDescriptionElement = document.createElement("div");
            controlsElement.appendChild(controlDescriptionElement);
            controlDescriptionElement.innerText = entry[0];
            controlDescriptionElement.style.textAlign = "right";
            const controlBindingElement = document.createElement("div");
            controlsElement.appendChild(controlBindingElement);
            controlBindingElement.innerText = entry[1];
            controlBindingElement.style.textAlign = "left";
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
        clearScoreButton.style.marginTop = "1vh";
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
        this.mainMenu.parentElement?.removeChild(this.mainMenu);
    }
}
