export default class Interpolation {
    /**
     * @param {number} x in the range [min .. max]
     * @param {number} min The lowest value in the range.
     * @param {number} max The highest value in the range.
     * @returns {number} in the range [0 .. 1]
     */
    static linear(x, min = 0, max = 1) {
        Interpolation.validateRange(min, max);

        if(x <= min) return 0;
        if(x >= max) return 1;

        return (x - min) / (max - min);
    }

    static validateRange(min, max) {
        if(min == max) throw new Error("Cannot interpolate over a zero-span.");
        if(isNaN(min)) throw new Error("Cannot interpolate; min is NaN.");
        if(isNaN(max)) throw new Error("Cannot interpolate; max is NaN.");
    }
}