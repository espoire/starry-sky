import RegularPolygon from "../geometry/RegularPolygon.js";
import { random, randomFromArray } from "../util/Util.js";
import MeshAnimation from "../animations/MeshAnimation.js";
import AnimationEffect from "../animations/Animate.js";
import Interpolation from "../math/Interpolation.js";

const starGeometry = RegularPolygon.getGeometry(4);
const starMaterial = new THREE.MeshBasicMaterial({ color: '#FFF' });

export default class Star {
    /**
     * @param {object} config
     * @param {object} config.position
     * @param {number} config.position.x
     * @param {number} config.position.y
     * @param {number} config.position.z
     * @param {object} config.frustum
     * @param {number} config.frustum.minZ
     * @param {number} config.frustum.maxZ
     * @param {number} config.frustum.angle
     */
    constructor(config) {
        this.mesh = generateMesh();
        this.frustum = config.frustum;
        this.setPosition(config.position);
    }

    getLimit() {
        return Math.sin(this.frustum.angle / 2) * (this.frustum.minZ + this.z);
    }

    /**
     * @param {object} position 
     * @param {number} position.x
     * @param {number} position.y
     * @param {number} position.z
     */
    setPosition(position) {
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
        this.limit = this.getLimit();
        
        this.updateMeshPosition();
    }

    scale(scale) {
        this.mesh.scale.set(scale, scale, scale);
    }

    updateMeshPosition() {
        this.mesh.position.set(this.x, this.y, this.frustum.minZ + this.z);
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

        this.updateMeshPosition();
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

        if(x > this.limit || y > this.limit || z < this.frustum.minZ) {
            // Note: this code doesn't work right.
            // Not fixing now because it's not in use anyway.
            console.log("Wrapped front to back.");

            this.z += this.frustum.maxZ - this.frustum.minZ;
            this.limit = this.getLimit();

            this.x = random(-this.limit, this.limit);
            this.y = random(-this.limit, this.limit);
        } else if(z > this.frustum.maxZ) {
            this.z -= this.frustum.maxZ - this.frustum.minZ;
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
     * @param {number} magnitude
     *      The scale multiplier at the height of the twinkle effect.
     * @param {number} millis
     *      The duration of the twinkle effect, in milliseconds.
     * @returns {MeshAnimation[]}
     *      Any animations to display.
     */
    maybeTwinkle(probability, magnitude, millis) {
        if(Math.random() < probability)
            return this.twinkle(magnitude, millis);
    }

    /**
     * @param {number} magnitude
     *      The scale multiplier at the height of the twinkle effect.
     * @param {number} millis
     *      The duration of the twinkle effect, in milliseconds.
     * @returns {MeshAnimation[]}
     *      Zero or more animations needed to produce the twinkle effect.
     */
    twinkle(magnitude, millis) {
        if(this.isTwinkling) return;
        this.isTwinkling = true;

        const star = this;

        return [
            new MeshAnimation({
                duration: millis / 2,
                mesh: this.mesh,
                effect: AnimationEffect.scale(1, magnitude),
            }),
            new MeshAnimation({
                startDelay: millis / 2,
                duration: millis / 2,
                mesh: this.mesh,
                effect: AnimationEffect.scale(magnitude, 1)
            }),
            new MeshAnimation({
                startDelay: millis,
                effect: AnimationEffect.callbackWhenComplete(function () {
                    star.isTwinkling = false;
                })
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

        return constellation[x][y];
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