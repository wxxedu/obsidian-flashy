import ReviewEntry from "./review_entry";
import { TFile, Vault } from "obsidian";
export default class CardModel {
    // Vault
    vault: Vault;
    // file path
    sourcePath: string;
    // the markdown source
    source: string;
    // list of ReviewEntry
    reviewHistory: ReviewEntry[] = [];
    // front of the card
    front: string;
    // back of the card
    back: string;

    constructor(source: string, filePath: string,  vault: Vault,) {
        this.source = source;
        this.sourcePath = filePath;
        this.vault = vault;
        this.disassemble(source);
    }

    disassemble(source: string) {
        let parts = source.split("\n---\n");
        this.front = parts[0];
        this.back = parts[1];
        if (parts.length > 2) {
            try {
                this.reviewHistory = JSON.parse(parts[2]).map(ReviewEntry.fromJSON);
            } catch (e) {
                console.log(e);
            }
        }
    }

    wrapWithMarkdownBlockCode(content: string) {
        return `\`\`\`flashy\n${content}\n\`\`\``
    }

    assemble(): string {
        return this.front + "\n---\n" + this.back + "\n---\n" + JSON.stringify(this.reviewHistory.map(entry => entry.toJSON()));
    }

    // add a review entry
    async addReviewEntry(entry: ReviewEntry) {
        this.reviewHistory.push(entry);
        const newSource = this.assemble();
        await this.updateSource(newSource);
    }

    // add a review entry with the given answer and current time
    async addReviewEntryWithAnswer(answer: string) {
        await this.addReviewEntry(new ReviewEntry(new Date(), answer));
    }


    // update the original markdown file with the current source
    async updateSource(newSource: string) {
        this.source = newSource;
        const file = this.vault.getAbstractFileByPath(this.sourcePath) as TFile;
        const content = await this.vault.read(file);
        const newContent = content.replace(this.wrapWithMarkdownBlockCode(this.source), this.wrapWithMarkdownBlockCode(newSource));
        await this.vault.modify(file, newContent);
    }
}