export class NormalizedImageData extends Array {
    constructor(image) {
        super(image.width);

        this.width = image.width;
        this.height = image.height;
        
        for(let x = 0; x < this.width; x++) {
            this[x] = [];
        }
        
        const raw = getRawData(image);
        for(let i = 0; i < raw.length; i += 4) {
            const index = i/4;
            const x = index % image.width;
            const y = Math.floor(index / image.width);

            const pixelData = new NormalizedPixelData(raw, i);
            this[x][y] = pixelData;
        }
    }

    toPropertyMap(property) {
        const ret = [];

        ret.width = this.width;
        ret.height = this.height;

        for(let x = 0; x < this.width; x++) {
            ret[x] = [];

            for(let y = 0; y < this.height; y++) {
                ret[x][y] = this[x][y][property];
            }
        }

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
