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
     * @param {Point3D} that
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