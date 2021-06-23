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

export function randomFromArray(array) {
    const index = randInt(0, array.length - 1);
    return array[index];
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