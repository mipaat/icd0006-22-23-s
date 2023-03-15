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
        HUDContainer.style.minHeight = gameBrain.vhValue(gameBrain.HUD_HEIGHT);
        HUDContainer.style.width = "100%";

        const HUDMenu = document.createElement("div");
        HUDMenu.style.minHeight = gameBrain.vhValue(gameBrain.HUD_HEIGHT);
        HUDMenu.style.alignContent = "center";
        HUDMenu.style.justifyContent = "center";
        HUDMenu.style.columnGap = "3vh";
        HUDMenu.style.rowGap = "2vh";
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
        scoreSectionElement.style.display = "flex";
        scoreSectionElement.style.flexDirection = "column";
        scoreSectionElement.style.justifyContent = "center";
        const scoreElement = document.createElement("div");
        scoreSectionElement.appendChild(scoreElement);
        this.scoreElement = scoreElement;
        if (this.racingGame.scores.length > 0) {
            const bestScoreElement = document.createElement("div");
            scoreSectionElement.appendChild(bestScoreElement);
            bestScoreElement.innerText = `Best: ${Math.round(this.racingGame.scores[0].points)}`;
        }
        const scoreMultiplierElement = document.createElement("div");
        scoreSectionElement.appendChild(scoreMultiplierElement);
        this.scoreMultiplierElement = scoreMultiplierElement;
        this.updateScoreInfo();

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

    updateScoreInfo() {
        this.scoreElement.innerText = `Score: ${Math.round(this.gameBrain.score)}`;
        this.scoreMultiplierElement.innerText = `Multiplier: ${Math.round(this.gameBrain.scoreMultiplier * 10) / 10}x`;
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