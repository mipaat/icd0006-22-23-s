export class Score {
    public points: number;
    public setAt: Date;

    constructor(points: number, setAt: Date) {
        this.points = points;
        this.setAt = setAt;
    }

    static comparePoints(score1: Score, score2: Score) {
        return score2.points - score1.points;
    }
}