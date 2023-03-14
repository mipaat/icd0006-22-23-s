export class Score {
    /**
     * 
     * @param {number} points 
     * @param {Date} setAt 
     */
    constructor(points, setAt) {
        this.points = points;
        this.setAt = setAt;
    }
}
/**
 * 
 * @param {Score} s1 
 * @param {Score} s2 
 */
Score.comparePoints = (s1, s2) => {
    return s2.points - s1.points;
}