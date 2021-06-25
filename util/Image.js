export class Map2D extends Array {
    constructor(width, height) {
        super(width);
        
        for(let x = 0; x < width; x++) {
            this[x] = new Array(height);
        }

        this.width = width;
        this.height = height;
    }

    /**
     * @param {number} xPortion
     *      The x position in this map, in the range [0 .. 1].
     * @param {number} yPortion
     *      The y position in this map, in the range [0 .. 1].
     * @returns {number}
     *      The weighted average of the 4 elements surrounding
     *      the specified position.
     */
    pixelInterpolate(xPortion, yPortion) {
        const x = xPortion * (this.width  - 1);
        const y = yPortion * (this.height - 1);
    
        const left   = Math.floor(x);
        const right  = Math.ceil (x);
        const bottom = Math.floor(y);
        const top    = Math.ceil (y);
    
        const  rightWeight = x - left;
        const   leftWeight = 1 - rightWeight;
        const    topWeight = y - bottom;
        const bottomWeight = 1 - topWeight;
        
        return topWeight * (rightWeight * this[right][top   ] + leftWeight * this[left][top   ]) +
            bottomWeight * (rightWeight * this[right][bottom] + leftWeight * this[left][bottom]);
    }
}

export class NormalizedImageData extends Map2D {
    constructor(image) {
        super(image.width, image.height);
        
        const raw = getRawData(image);
        for(let i = 0; i < raw.length; i += 4) {
            const index = i/4;
            const x = index % image.width;

            // For whatever reason, CanvasRenderingContext2D.getImageData sends us upside-down image info?
            const y = image.height - 1 - Math.floor(index / image.width);

            const pixelData = new NormalizedPixelData(raw, i);
            this[x][y] = pixelData;
        }
    }

    toPropertyMap(property) {
        const ret = new Map2D(this.width, this.height);

        for(let x = 0; x < this.width; x++)
            for(let y = 0; y < this.height; y++)
                ret[x][y] = this[x][y][property];
        
        return ret;
    }

    toBrightnessMap() {
        return this.toPropertyMap('brightness');
    }
}

export class NormalizedPixelData {
    constructor(r, g, b, a) {
        if(Array.isArray(r) || r instanceof Uint8ClampedArray) {
            const rawData = r;
            const offset = g;

            r = rawData[offset + 0];
            g = rawData[offset + 1];
            b = rawData[offset + 2];
            a = rawData[offset + 3];
        } else if(typeof r == 'object') {
            const config = r;

            r = config.r;
            g = config.g;
            b = config.b;
            a = config.a;
        } else {
            console.log("Case 3");
        }

        if(a == undefined) a = 255;

        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;

        this.brightness = this.a * (this.r + this.g + this.b) / 3;
    }
}

function getRawData(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

    return canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
}
