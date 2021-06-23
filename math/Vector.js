export class Vector2D {
    constructor(x = 0, y = 0) {
        if(typeof x !== 'number') throw new Error("Cannot create Vector2D with non-number x-coordinate: ", x);
        if(typeof y !== 'number') throw new Error("Cannot create Vector2D with non-number y-coordinate: ", y);

        this.x = x;
        this.y = y;

        Object.freeze(this);
    }

    static zero = new Vector2D();

    scale(scalar) {
        return new Vector2D(
            this.x * scalar,
            this.y * scalar
        );
    }

    add(vector) {
        return new Vector2D(
            this.x + vector.x,
            this.y + vector.y
        );
    }

    /**
     * @param {Vector2D} that
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
        return "[Vector2D: " + this.x + "," + this.y + "]";
    }
}

export class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        if(typeof x !== 'number') throw new Error("Cannot create Vector3D with non-number x-coordinate: ", x);
        if(typeof y !== 'number') throw new Error("Cannot create Vector3D with non-number y-coordinate: ", y);
        if(typeof z !== 'number') throw new Error("Cannot create Vector3D with non-number z-coordinate: ", z);

        this.x = x;
        this.y = y;
        this.z = z;

        Object.freeze(this);
    }

    static zero = new Vector3D();

    scale(scalar) {
        return new Vector3D(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        );
    }

    add(vector) {
        return new Vector3D(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        );
    }

    /**
     * @param {Vector3D} that
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
        return "[Vector3D: " + this.x + "," + this.y + "," + this.z + "]";
    }
}