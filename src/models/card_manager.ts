import { TFile, Vault } from "obsidian";
import CardModel from "./card_model";


export default class CardManager {
    index: number;
    cards: CardModel[];
    filteredCards: CardModel[];
    mode: number;
    saveIndexAndMode: (index: number, mode: number) => Promise<void>;

    constructor(index: number, mode: number = 0, cards: CardModel[], saveIndexAndMode: (index: number, mode: number) => Promise<void>) {
        this.index = index;
        this.cards = cards;
        this.mode = mode;
        this.filteredCards = CardManager.filterCards(mode, cards);
        this.saveIndexAndMode = saveIndexAndMode;
        saveIndexAndMode(index, mode);
    }

    static filterCards(mode: number, cards: CardModel[]): CardModel[] {
        switch (mode) {
            case 0:
                return cards;
            case 1:
                return cards.filter(card => card.reviewHistory.length === 0);
            case 2:
                return cards.filter(card => card.reviewHistory.length > 0 && card.reviewHistory[card.reviewHistory.length - 1].answer === "wrong");
            case 3:
                return cards.filter(card => card.reviewHistory.length > 0 && card.reviewHistory[card.reviewHistory.length - 1].answer === "wrong" && card.reviewHistory[card.reviewHistory.length - 1].time.getDate() === new Date().getDate());
            default:
                return cards;
        }
    }

    saveState() {
        this.saveIndexAndMode(this.index, this.mode);
    }

    getCurrentCard(): CardModel { 
        if (this.hasFinished()) {
            return null;
        }
        return this.filteredCards[this.index];
    }

    moveToNextCard(): CardManager { 
        if (this.hasFinished()) {
            return this;
        }
        return new CardManager(this.index + 1, this.mode, this.cards, this.saveIndexAndMode);
    }

    moveToPreviousCard(): CardManager {
        if (this.index === 0) {
            return this;
        }
        return new CardManager(this.index - 1, this.mode, this.cards, this.saveIndexAndMode);
    }

    hasFinished(): boolean {
        return this.index >= this.filteredCards.length;
    }

    reset(): CardManager {
        return new CardManager(0, this.mode, this.cards, this.saveIndexAndMode);
    }

    setMode(mode: number): CardManager {
        return new CardManager(this.index, mode, this.cards, this.saveIndexAndMode);
    }

    reviewAll(): CardManager {
        return this.setMode(0);
    }

    reviewToday(): CardManager {
        return this.setMode(1);
    }

    reviewWrong(): CardManager {
        return this.setMode(2);
    }

    reviewTodayAndWrong(): CardManager {
        return this.setMode(3);
    }

    static join(managerA: CardManager, managerB: CardManager): CardManager { 
        const cards = managerA.cards.concat(managerB.cards);
        return new CardManager(managerA.index, managerA.mode, cards, managerA.saveIndexAndMode);
    }

    static async fromVault(vault: Vault): Promise<CardManager> {
        const files = await vault.getMarkdownFiles();
        let result: CardManager = null;
        for(let file of files) {
            if (result == null) {
                result = await CardManager.fromFile(file, vault);
                continue;
            } 
            const newResult = await CardManager.fromFile(file, vault);
            if (newResult != null) {
                result = CardManager.join(result, newResult);
            }
        }
        return result;
    }

    // factory method
    static async fromFile(file: TFile, vault: Vault, codeContent?: string): Promise<CardManager> { 
        const fileContent = await vault.read(file);
        const flashyRegex = new RegExp("^```flashy\n((?:.|\n)*?)\n```$", "gm");
        
        const segments = fileContent.matchAll(flashyRegex);
        // if found no flashy segments, return null
        let cards: CardModel[] = [];
        for(let segment of segments) {
            cards.push(new CardModel(segment[1], file.path, vault));
        }
        if (cards.length === 0) {
            return null;
        }
        let mode = 0;
        let index = 0;
        if (codeContent != null) {
            try {
                // parse the code content as json
                const code = JSON.parse(codeContent);
                mode = code.mode;
                index = code.index;
            } catch (e) {
                console.log(e);
            }
        }
        return new CardManager(index, mode, cards, async (index: number, mode: number) => {
            const flashyCardsRegex = new RegExp("^```flashy-cards\n((?:.|\n)*?)\n```$", "gm");
            const flashyCards = fileContent.matchAll(flashyCardsRegex);
            const newContentJson = {"mode": mode, "index": index};
            const newContent = JSON.stringify(newContentJson);
            for(let flashyCard of flashyCards) {
                const newFileContent = fileContent.replace(flashyCard[0], CardManager._wrapWithMDCode("flashy-cards", newContent));
                await vault.modify(file, newFileContent);
            }
        });
    }

    static _wrapWithMDCode(lang: string, content: string): string { 
        return `\`\`\`${lang}\n${content}\n\`\`\``;
    }
}