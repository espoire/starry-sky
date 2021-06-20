import { fill } from "../util/Array.js";

(function() {
    Array.prototype.fillDeep = function (value) {
        return fill(this, value);
    };

    Array.prototype.pushAll = function(array) {
        for(const element of array)
            this.push(element);

        return this.length;
    }
})();