import { padStringLeft } from "./Util.js";

const sortFunctions = {
    numeric(a, b) { return a - b; },
    reverseNumeric(a, b) { return b - a; }
};

/** Returns a new array containing the argument, or a clone of
 * the argument if it was already an array.
 * 
 * @param {any} maybeArray 
 * @returns {any[]}
 */
export function ensureArray(maybeArray) {
    if(maybeArray === null || maybeArray == undefined) return [];
    if(Array.isArray(maybeArray)) return [...maybeArray];
    return [maybeArray];
}

/** Creates a new blank array with the specified dimension(s).
 * 
 * @param {...number} length 
 * @returns {Array}
 */
export function array(length) {
    const arr = new Array(length || 0);

    if (arguments.length > 1) {
        const args = Array.prototype.slice.call(arguments, 1);

        let i = length;
        while(i--)
            arr[length-1 - i] = array.apply(this, args);
    }

    return arr;
}

/** Resets all members of a multidimensional array to the provided value.
 * (If that value is an object, all references will point to the SAME object.)
 * 
 * @param {any[]} arr
 * @param {any} value
 */
export function fill(arr, value) {
    for(let i = 0; i < arr.length; i++) {
        if(Array.isArray(arr[i])) {
            fill(arr[i], value);
        } else {
            arr[i] = value;
        }
    }

    return arr;
}

export const prettyPrint2DRectArray = (function () {
    function toString(value, printAsBlank) {
        if(value === null || value === undefined) return " ";
        if(printAsBlank.includes(value)) return " ";

        try {
            return value.toString();
        } catch {
            return value + "";
        }
    }

    return function prettyPrint2DRectArray(array, ...printAsBlank) {
        let longest = 0;
        for(let x = 0; x < array.length; x++) {
            for(let y = 0; y < array[x].length; y++) {
                const stringOf = toString(array[x][y], printAsBlank);
                if(stringOf.length > longest) longest = stringOf.length;
            }
        }
    
        let prettyPrint = "";
        let x = 0;
        for(let y = array[x].length - 1; y >= 0; y--) {
            for(let x = 0; x < array.length; x++)
                prettyPrint += padStringLeft(toString(array[x][y], printAsBlank), longest) + " ";
            prettyPrint += "\n";
        }
        console.log(prettyPrint);
    }
})();

/** Removes zero or more items from an array by index.
 * 
 * @param {Array} array 
 * @param  {...number} indexes
 * @returns {Array} Array containing the removed items.
 */
export function removeMultipleIndexes(array, ...indexes) {
    let ret = [];

    indexes.sort(sortFunctions.reverseNumeric);

    for(const index of indexes)
        ret.push(array.splice(index, 1)[0]);
    
    return ret;
}

/** Returns a new array containing the non-null elements
 * of the target array, even if it is sparse.
 * 
 * @param {Array} array 
 * @returns {Array}
 */
export function compactSparseArray(array) {
    return array.filter(function (x) {
        return x != null;
    });
}