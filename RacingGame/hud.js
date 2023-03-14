import { GameBrain } from "./game_brain.js";
import { removeAllChildNodes } from "./utils.js";

export class HUD {
    /**
     * 
     * @param {GameBrain} gameBrain 
     */
    constructor(gameBrain) {
        this.gameBrain = gameBrain;
        this.racingGame = gameBrain.racingGame;

        removeAllChildNodes(this.racingGame.HUDLayer);

        const HUDContainer = document.createElement("div");
        HUDContainer.style.background = "black";
        HUDContainer.style.height = gameBrain.vhValue(gameBrain.HUD_HEIGHT);
        HUDContainer.style.width = "100%";

        const HUDMenu = document.createElement("div");
        HUDMenu.style.height = gameBrain.vhValue(gameBrain.HUD_HEIGHT);
        HUDMenu.style.width = "60vh";
        HUDMenu.style.margin = "auto";
        HUDMenu.style.padding = "2vh";
        HUDMenu.style.boxSizing = "border-box";
        HUDMenu.style.background = "black";
        HUDMenu.style.display = "flex";
        HUDMenu.style.flexWrap = "wrap";
        HUDContainer.appendChild(HUDMenu);

        const healthSectionElement = document.createElement("div");
        healthSectionElement.classList.add("hud-section");
        const healthText = document.createElement("div");
        healthText.style.textAlign = "left";
        healthText.innerText = "HP:";
        healthSectionElement.appendChild(healthText);
        const hpContainer = document.createElement("div");
        hpContainer.style.gap = "1vh";
        hpContainer.style.display = "flex";
        hpContainer.style.flexWrap = "wrap";
        healthSectionElement.appendChild(hpContainer);
        this.hpContainer = hpContainer;
        this.updateHp();
        HUDMenu.appendChild(healthSectionElement);

        const stageSectionElement = document.createElement("div");
        stageSectionElement.classList.add("hud-section");
        const stageLabelElement = document.createElement("div");
        this.stageLabelElement = stageLabelElement;
        stageLabelElement.style.fontSize = "5vh";
        stageSectionElement.appendChild(stageLabelElement);
        const stageLevelElement = document.createElement("div");
        this.stageLevelElement = stageLevelElement;
        stageSectionElement.appendChild(stageLevelElement);
        HUDMenu.appendChild(stageSectionElement);
        this.updateStageInfo();

        const scoreSectionElement = document.createElement("div");
        HUDMenu.appendChild(scoreSectionElement);
        scoreSectionElement.classList.add("hud-section");
        const scoreElement = document.createElement("div");
        scoreSectionElement.appendChild(scoreElement);
        this.scoreElement = scoreElement;
        this.updateScore();
        if (this.racingGame.scores.length > 0) {
            const bestScoreElement = document.createElement("div");
            scoreSectionElement.appendChild(bestScoreElement);
            bestScoreElement.innerText = `Best: ${Math.round(this.racingGame.scores[0].points)}`;
        }

        this.racingGame.HUDLayer.appendChild(HUDContainer);
    }

    updateHp() {
        removeAllChildNodes(this.hpContainer);

        for (let hp = 0; hp < this.gameBrain.health; hp++) {
            const hpElement = document.createElement("div");
            hpElement.style.background = "#F00";
            hpElement.style.width = "2vh";
            hpElement.style.height = "2vh";
            hpElement.style.borderRadius = "1vh";
            this.hpContainer.appendChild(hpElement);
        }        
    }

    updateScore() {
        this.scoreElement.innerText = `Score: ${Math.round(this.gameBrain.score)}`;
    }

    updateStageInfo() {
        this.stageLabelElement.innerText = this.gameBrain.stageLabel;
        this.stageLevelElement.innerText = `Speed: ${this.gameBrain.rowsPerSecond}`;
    }

    deactivate() {
        removeAllChildNodes(this.racingGame.HUDLayer);
        this.gameBrain.HUD = null;
        this.gameBrain = null;
    }
}