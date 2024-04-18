import { random } from "../util/Util.js";
import Star from "./Star.js";
import AnimationManager from "../animations/AnimationManager.js";
import Interpolation from "../math/Interpolation.js";
import Easings from "../math/Easings.js";
import { degreesToRadians } from "../util/Angle.js";
import { Vector3D } from "../math/Vector.js";

export default class Sky extends AnimationManager {
    /**
     * @param {object} config
     * @param {number} config.stars
     *      The number of stars to generate. Defaults to 1000.
     * @param {object} config.frustum
     *      An object representing the details of the viewing
     *      frustum to be filled with stars. A frustum is like
     *      a cone, but with a polygonal cross-section instead
     *      of the usual curcular cross-section.
     * @param {number} config.frustum.near
     *      The minimum distance from the apex,
     *      beyond which stars may appear.
     * @param {number} config.frustum.far
     *      The maximum distance from the apex,
     *      beyond which stars may NOT appear.
     * @param {number} config.frustum.angle
     *      The angle in degrees formed by two sides of the
     *      frustum. This is the smallest such angle which
     *      is bisected by the central ray of the frustum.
     * @param {object} config.effects
     * @param {{x: number, y: number, z: number}} config.effects.motion
     * @param {object} config.effects.wave
     * @param {{x: number, y: number, z: number}} config.effects.wave.amplitude
     * @param {number} config.effects.wave.period
     * @param {object} config.effects.twinkle
     * @param {number} config.effects.twinkle.rate
     *      The average number of twinkles per second.
     * @param {number} config.effects.twinkle.magnitude
     *      The maximum scale at the height of the twinkle effect.
     * @param {number} config.effects.twinkle.duration
     *      The duration of the twinkle effect in seconds.
     * @param {object} config.effects.constellation
     * @param {number} config.effects.constellation.delay
     * @param {number} config.effects.constellation.fadeIn
     * @param {number} config.effects.constellation.magnitude
     * @param {number[][]} config.effects.constellation.image
     */
    constructor(config) {
        super();

        this.frustum = config.frustum;
        this.frustum.angle = degreesToRadians(this.frustum.angle);
        this.frustum.volume = getFrustumVolume(this.frustum);

        this.effects = config.effects || {};

        this.stars = Array(config.stars || 1000).fill().map(this.generateStar.bind(this));
    }

    generateStar() {
        const v = random(0, this.frustum.volume);
        const z = getFrustumHeight(this.frustum.near, v);

        const xyLimit = (z + this.frustum.near) * Math.sin(this.frustum.angle / 2);
        const x = random(-xyLimit, xyLimit);
        const y = random(-xyLimit, xyLimit);

        const star = new Star({
            position: {
                x: x,
                y: y,
                z: z
            },
            frustum: this.frustum
        });

        return star;
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    update(time, delta) {
        const vector = this.getTranslationVector(time, delta);

        const probability = this.getTwinkleProbabilityPerStar(delta);
        const magnitude = this.getConstellationMagnitude(time);

        for (const star of this.stars) {
            star.translate(vector);

            if (this.effects.twinkle) {
                const animations = star.maybeTwinkle(probability, this.effects.twinkle.magnitude, this.effects.twinkle.duration);
                this.addAnimations(animations);
            }

            if (this.effects.constellation) {
                star.constellate(this.effects.constellation.image, magnitude);
            }
        }

        super.update();
    }

    getTranslationVector(time, delta) {
        let translation = Vector3D.zero;

        translation = translation.add(this.getWaveVector  (time, delta));
        translation = translation.add(this.getMotionVector(      delta));

        return translation;
    }

    getMotionVector(delta) {
        if (!this.effects.motion)
            return Vector3D.zero;

        return new Vector3D(
            this.effects.motion.x * delta,
            this.effects.motion.y * delta,
            this.effects.motion.z * delta
        );
    }

    getWaveVector(time, delta) {
        if (!this.effects.wave)
            return Vector3D.zero;

        const prevPhase = Math.sin(2 * Math.PI * (time - delta) / this.effects.wave.period);
        const wavePhase = Math.sin(2 * Math.PI * time / this.effects.wave.period);
        const deltaPhase = wavePhase - prevPhase;

        return new Vector3D(
            this.effects.wave.amplitude.x * deltaPhase,
            this.effects.wave.amplitude.y * deltaPhase,
            this.effects.wave.amplitude.z * deltaPhase
        );
    }

    getTwinkleProbabilityPerStar(delta) {
        if (!this.effects.twinkle) return 0;

        const secondsPerTwinklePerStar = (1 / this.effects.twinkle.rate) * this.stars.length;
        const probability = (delta > 1 ? 1 : delta) / secondsPerTwinklePerStar;

        return probability;
    }

    getConstellationMagnitude(time) {
        if (!this.effects.constellation) return 0;

        const progress = Interpolation.linear(time - this.effects.constellation.delay, 0, this.effects.constellation.fadeIn);
        const magnitude = this.effects.constellation.magnitude * Easings.easeInOutCubic(progress);

        return magnitude;
    };

    getAllMeshes() {
        return this.stars.map(star => star.mesh);
    }
}

function getFrustumVolume(frustum) {
    return getConeVolume(frustum.far) -
        getConeVolume(frustum.near);
}

function getConeVolume(height) {
    return Math.pow(height, 3) / 3;
}

function getFrustumHeight(frustumNearPlane, volume) {
    return getConeHeight(volume + getConeVolume(frustumNearPlane));
}

function getConeHeight(volume) {
    return Math.cbrt(3 * volume);
}