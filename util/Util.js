export function padStringLeft(string, length) {
    while(string.length < length) string = " " + string;
    return string;
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export class Point2D {
    constructor(x, y) {
        if(typeof x !== 'number') throw new Error("Cannot create Point2D with non-number x-coordinate: ", x);
        if(typeof y !== 'number') throw new Error("Cannot create Point2D with non-number y-coordinate: ", y);

        this.x = x;
        this.y = y;

        Object.freeze(this);
    }

    /**
     * @param {Point2D} that
     * @returns {boolean}
     */
    equals(that) {
        return (this.x == that.x && this.y == that.y);
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.toIdString();
    }

    /**
     * @returns {string}
     */
    toIdString() {
        return "[Point2D: " + this.x + "," + this.y + "]";
    }
}

export class Point3D {
    constructor(x, y, z) {
        if(typeof x !== 'number') throw new Error("Cannot create Point3D with non-number x-coordinate: ", x);
        if(typeof y !== 'number') throw new Error("Cannot create Point3D with non-number y-coordinate: ", y);
        if(typeof z !== 'number') throw new Error("Cannot create Point3D with non-number z-coordinate: ", z);

        this.x = x;
        this.y = y;
        this.z = z;

        Object.freeze(this);
    }

    /**
     * @param {Point2D} that
     * @returns {boolean}
     */
    equals(that) {
        return (this.x == that.x && this.y == that.y && this.z == that.z);
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.toIdString();
    }

    /**
     * @returns {string}
     */
    toIdString() {
        return "[Point3D: " + this.x + "," + this.y + "," + this.z + "]";
    }
}

export const GeneralSet = (function () {
    function toIdString(item) {
        if(item && typeof item.toIdString === 'function')
            return item.toIdString();
        return item + "";
    }

    return class GeneralSet {
        constructor() {
            this.map = new Map();
            this[Symbol.iterator] = this.values;
            this.size = 0;
        }

        add(item) {
            this.map.set(toIdString(item), item);
            this.size = this.map.size;
        }

        addAll(array) {
            for(const element of array)
                this.add(element);
        }

        values() {
            return this.map.values();
        }

        getFirst() {
            return this.getIndex(0);
        }

        getIndex(index) {
            const values = this.values();

            for(let i = 0; i < index; i++) values.next();

            return values.next().value;
        }

        toArray() {
            let ret = [];

            const values = this.values();
            for (let i = values.next(); !i.done; i = values.next())
                ret.push(i.value);
            
            return ret;
        }

        delete(item) {
            const ret = this.map.delete(toIdString(item));
            this.size = this.map.size;
            return ret;
        }

        clear() {
            for(const element of this.values())
                this.delete(element);
        }

        has(item) {
            return this.map.has(toIdString(item));
        }

        forEach(callbackFn, thisArg) {
            this.map.forEach(callbackFn, thisArg);
        }
    };
})();