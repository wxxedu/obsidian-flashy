export default class ReviewEntry {
    time: Date;
    answer: string;
    constructor(time: Date, answer: string) {
        this.time = time;
        this.answer = answer;
    }

    // to json
    toJSON() {
        return {
            time: this.time.toISOString(),
            answer: this.answer
        };
    }

    // to json string
    toJSONString() {
        return JSON.stringify(this.toJSON());
    }

    // from json
    static fromJSON(json: any): ReviewEntry {
        return new ReviewEntry(new Date(json.time), json.answer);
    }

    // from json string
    static fromJSONString(jsonString: string): ReviewEntry {
        return ReviewEntry.fromJSON(JSON.parse(jsonString));
    }
}