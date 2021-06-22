import RegularPolygon from "../geometry/RegularPolygon.js";
import { random, randomFromArray } from "../util/Util.js";
import MeshAnimation from "../animations/MeshAnimation.js";
import Animate from "../animations/Animate.js";
import Interpolation from "../math/Interpolation.js";

const starGeometry = RegularPolygon.getGeometry(4);
const starMaterial = new THREE.MeshBasicMaterial({ color: '#FFF' });

export default class Star {
    // TODO convert to config object
    constructor(x, y, z, camera, starDistanceLimits, twinkleProperties) {
        this.camera = camera;
        this.starDistanceLimits = starDistanceLimits;
        this.twinkleProperties = twinkleProperties;

        this.mesh = generateMesh();

        this.setPosition(x, y, z);
        
        this.isTwinkling = 0;
    }

    getLimit() {
        const camera = this.camera;
        const z = this.z;

        return Math.sin(camera.fov / 2) * (camera.distance + z)
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.limit = this.getLimit();
        
        this.syncGraphicsToPosition();
    }

    scale(scale) {
        this.mesh.scale.set(scale, scale, scale);
    }

    syncGraphicsToPosition() {
        this.mesh.position.set(this.x, this.y, -this.z);
    }

    translate(deltaX, deltaY, deltaZ) {
        if(deltaX != 0) {
            this.x += deltaX;
            this.wrapX();
        }

        if(deltaY != 0) {
            this.y += deltaY;
            this.wrapY();
        }

        if(deltaZ != 0) {
            this.z += deltaZ;
            this.limit = this.getLimit();
            this.wrapZ();
        }

        this.syncGraphicsToPosition();
    }

    wrapX() {
        if(this.x < -this.limit) {
            this.x += 2 * this.limit;
        } else if(this.x > this.limit) {
            this.x -= 2 * this.limit;
        }
    }

    wrapY() {
        if(this.y < -this.limit) {
            this.y += 2 * this.limit;
        } else if(this.y > this.limit) {
            this.y -= 2 * this.limit;
        }
    }

    wrapZ() {
        const x = Math.abs(this.x);
        const y = Math.abs(this.y);
        const z =          this.z;

        if(x > this.limit || y > this.limit || z < this.starDistanceLimits.min) {
            // Note: this code doesn't work right.
            // Not fixing now because it's not in use anyway.
            console.log("Wrapped front to back.");

            this.z += this.starDistanceLimits.max - this.starDistanceLimits.min;
            this.limit = this.getLimit();

            this.x = random(-this.limit, this.limit);
            this.y = random(-this.limit, this.limit);
        } else if(z > this.starDistanceLimits.max) {
            this.z -= this.starDistanceLimits.max - this.starDistanceLimits.min;
            this.limit = this.getLimit();

            if(Math.random() < 0.5) {
                this.x = randomFromArray([-this.limit, this.limit]);
                this.y = random         ( -this.limit, this.limit );
            } else {
                this.x = random         ( -this.limit, this.limit );
                this.y = randomFromArray([-this.limit, this.limit]);
            }
        }
    }

    /**
     * @param {number} probability 
     *      The probability of starting a twinkle this frame.
     * @returns {MeshAnimation[]}
     *      Any animations to display.
     */
    twinkle(probability, magnitude, delta = 0) {
        this.isTwinkling -= delta;

        if(this.isTwinkling <= 0)
            if(Math.random() < probability)
                return this.beginTwinkle(magnitude);
    }

    /**
     * @param {number} magnitude
     * @returns {MeshAnimation[]}
     *      Zero or more animations needed to produce the twinkle effect.
     */
    beginTwinkle(magnitude) {
        this.isTwinkling = this.twinkleProperties.durationMillis / 1000;

        return [
            new MeshAnimation({
                duration: this.twinkleProperties.durationMillis / 2,
                mesh: this.mesh,
                animation: Animate.scale(1, magnitude),
            }),
            new MeshAnimation({
                startDelay: this.twinkleProperties.durationMillis / 2,
                duration: this.twinkleProperties.durationMillis / 2,
                mesh: this.mesh,
                animation: Animate.scale(magnitude, 1)
            })
        ];
    }

    /** Enlarges this star if it is over a bright area of the constellation image.
     * 
     * @param {number[][]} constellation
     */
    constellate(constellation, magnitude) {
        const pixel = this.getConstellationImagePixelBrightness(constellation);
        const scale = pixel * magnitude;

        this.scale(1 + scale);
    }

    getConstellationImagePixelBrightness(constellation) {
        let x = Math.floor(this.getRelativeX() * constellation.width);
        let y = Math.floor(this.getRelativeY() * constellation.height);

        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > constellation.width  - 1) x = constellation.width  - 1;
        if(y > constellation.height - 1) y = constellation.height - 1;

        let constellationImagePixelBrightness = constellation[x][y];

        return constellationImagePixelBrightness;
    }

    getRelativeX() {
        return Interpolation.linear(this.x, -this.limit, this.limit);
    }

    getRelativeY() {
        return Interpolation.linear(this.y, -this.limit, this.limit);
    }
}

function generateMesh() {
    return new THREE.Mesh(
        starGeometry,
        starMaterial
    );
}