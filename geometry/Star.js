import RegularPolygon from "./RegularPolygon.js";
import { random, randomFromArray } from "../util/Util.js";
import MeshAnimation from "../animations/MeshAnimation.js";
import AnimationEffect from "../animations/Animate.js";
import Interpolation from "../math/Interpolation.js";
import { Map2D } from "../util/Image.js";
import { Mesh, MeshBasicMaterial } from "three";

const starGeometry = RegularPolygon.getGeometry(4);
const starMaterial = new MeshBasicMaterial({ color: '#FFF' });

export default class Star {
    /**
     * @param {object} config
     * @param {object} config.position
     * @param {number} config.position.x
     * @param {number} config.position.y
     * @param {number} config.position.z
     * @param {object} config.frustum
     * @param {number} config.frustum.near
     * @param {number} config.frustum.far
     * @param {number} config.frustum.angle
     */
    constructor(config) {
        this.mesh = generateMesh();
        this.frustum = config.frustum;
        this.setPosition(config.position);
    }

    getLimit() {
        return Math.sin(this.frustum.angle / 2) * (this.frustum.near + this.z);
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
        const z = this.frustum.near + this.z;
        this.mesh.position.set(this.x, this.y, -z);
    }

    /**
     * @param {Vector3D} vector 
     */
    translate(vector) {
        if(vector.x != 0) {
            this.x += vector.x;
            this.wrapX();
        }

        if(vector.y != 0) {
            this.y += vector.y;
            this.wrapY();
        }

        if(vector.z != 0) {
            this.z += vector.z;
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

        if(x > this.limit || y > this.limit || z < this.frustum.near) {
            // Note: this code doesn't work right.
            // Not fixing now because it's not in use anyway.
            console.log("Wrapped front to back.");

            this.z += this.frustum.far - this.frustum.near;
            this.limit = this.getLimit();

            this.x = random(-this.limit, this.limit);
            this.y = random(-this.limit, this.limit);
        } else if(z > this.frustum.far) {
            this.z -= this.frustum.far - this.frustum.near;
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
     * @param {number} duration
     *      The duration of the twinkle effect, in seconds.
     * @returns {MeshAnimation[]}
     *      Any animations to display.
     */
    maybeTwinkle(probability, magnitude, duration) {
        if(Math.random() < probability)
            return this.twinkle(magnitude, duration);
    }

    /**
     * @param {number} magnitude
     *      The scale multiplier at the height of the twinkle effect.
     * @param {number} duration
     *      The duration of the twinkle effect, in seconds.
     * @returns {MeshAnimation[]}
     *      Zero or more animations needed to produce the twinkle effect.
     */
    twinkle(magnitude, duration) {
        if(this.isTwinkling) return;
        this.isTwinkling = true;

        const star = this;
        const durationMillis = duration * 1000;

        return [
            new MeshAnimation({
                duration: durationMillis / 2,
                mesh: this.mesh,
                effect: AnimationEffect.scale(1, magnitude),
            }),
            new MeshAnimation({
                startDelay: durationMillis / 2,
                duration: durationMillis / 2,
                mesh: this.mesh,
                effect: AnimationEffect.scale(magnitude, 1)
            }),
            new MeshAnimation({
                startDelay: durationMillis,
                effect: AnimationEffect.callbackWhenComplete(function () {
                    star.isTwinkling = false;
                })
            })
        ];
    }

    /** Enlarges this star if it is over a bright area of the constellation image.
     * 
     * @param {Map2D} constellation
     * @param {number} magnitude
     */
    constellate(constellation, magnitude) {
        const pixel = constellation.pixelInterpolate(this.getRelativeX(), this.getRelativeY());
        this.addMagnitude(pixel * magnitude);
    }

    getRelativeX() {
        return Interpolation.linear(this.x, -this.limit, this.limit);
    }

    getRelativeY() {
        return Interpolation.linear(this.y, -this.limit, this.limit);
    }

    /**
     * @param {number} magnitude 
     */
    addMagnitude(magnitude) {
        const baseMagnitude = this.getMagnitude();
        const scale = this.getScaleForMagnitude(baseMagnitude + magnitude);
        this.scale(scale);
    }

    getMagnitude(scale = 1) {
        const z = this.frustum.near + this.z;
        return 1000 / z * scale; // Apparent magnitude "1" arbitrarily defined to be at distance 1000.
    }

    getScaleForMagnitude(magnitude) {
        const z = this.frustum.near + this.z;
        return magnitude * z / 1000;
    }
}

function generateMesh() {
    return new Mesh(
        starGeometry,
        starMaterial
    );
}