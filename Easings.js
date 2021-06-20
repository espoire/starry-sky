const pow = Math.pow;

export default class Easings {
    /**
     * @param {number} x in the range [0 .. 1]
     * @returns {number} in the range [0 .. 1]
     */
    static easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
    }

    /**
     * @param {number} x in the range [0 .. 1]
     * @param {number} exponent to use for curve steepness
     * @returns {number} in the range [0 .. 1]
     */
    static easeInOutExpo(x, exponent = 10) {
        return x === 0 ?
            0 : 
        x === 1 ?
            1 :
        x < 0.5 ?
            pow(2, 2 * exponent * x - exponent) / 2 :
            (2 - pow(2, -2 * exponent * x + exponent)) / 2;
    }
}