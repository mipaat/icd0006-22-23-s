import { GameBrain } from "./game_brain";
import { removeAllChildNodes } from "./utils";
import { EventType } from "./enums/event_type";

export class EndScreen {
    private get racingGame() {
        return this.gameBrain.racingGame;
    }

    private readonly endScreen: HTMLDivElement;

    constructor(private readonly gameBrain: GameBrain) {
        const endScreenElement = document.createElement("div");
        this.endScreen = endScreenElement;
        this.racingGame.blockingMenuLayer.appendChild(endScreenElement);
        endScreenElement.classList.add("overlay-blocking-menu");

        const titleDiv = document.createElement("div");
        endScreenElement.appendChild(titleDiv);
        titleDiv.innerText = "GAME OVER";
        titleDiv.classList.add("text-large");

        const scoreDisplay = document.createElement("div");
        endScreenElement.appendChild(scoreDisplay);
        scoreDisplay.innerText = `Score: ${Math.round(gameBrain.score)}`;
        scoreDisplay.classList.add("text-medium");
        this.racingGame.refreshScores();
        const highScore = this.racingGame.scores[0]?.points ?? -100;
        if (highScore < gameBrain.score) {
            const newBest = document.createElement("div");
            scoreDisplay.appendChild(newBest);
            newBest.innerText = "NEW BEST!!!";
            newBest.classList.add("text-normal");
        }

        const buttonsDiv = document.createElement("div");
        endScreenElement.appendChild(buttonsDiv);
        buttonsDiv.style.marginTop = "2vh";
        buttonsDiv.style.display = "flex";
        buttonsDiv.style.flexDirection = "column";

        const restartButton = document.createElement("button");
        buttonsDiv.appendChild(restartButton);
        restartButton.style.marginTop = "2vh";
        restartButton.classList.add("text-normal");
        restartButton.innerText = "Restart";
        restartButton.addEventListener(EventType.Click, () => {this.racingGame.restart()});

        const mainMenuButton = document.createElement("button");
        buttonsDiv.appendChild(mainMenuButton);
        mainMenuButton.style.marginTop = "1vh";
        mainMenuButton.classList.add("text-normal");
        mainMenuButton.innerText = "Main Menu";
        mainMenuButton.addEventListener(EventType.Click, () => {this.racingGame.loadMainMenu()});

        this.racingGame.saveScore(this.gameBrain.score);
    }

    deactivate() {
        removeAllChildNodes(this.racingGame.blockingMenuLayer);
    }
}