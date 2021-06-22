import { degreesToRadians } from "../util/Angle.js";
import { random } from "../util/Util.js";
import Star from "./Star.js";
import AnimationManager from "../animations/AnimationManager.js";
import Interpolation from "../math/Interpolation.js";
import Easings from "../math/Easings.js";

// TODO convert settings to config object

const camera = {
    fov: degreesToRadians(20),
    distance: 20
};
const starDistance = {
    min: 500,
    max: 2000
};
const maxVolume = getMaxVolume();
const count = 6000;

const starDrift = {
    x: 4,
    y: 0,
    z: 0
};

const starWave = {
    amplitude: {
        x: 0,
        y: 10,
        z: 0
    },

    period: 15
}

const twinkle = {
    secondsPerOcurrence: 2000,
    scaleMax: 10,
    durationMillis: 500,
}

const constellate = {
    delay: 2,
    fadeIn: 4,
    magnitude: 2
}

function getConstellationMagnitude(time) {
    const progress = Interpolation.linear(time, constellate.delay, constellate.delay + constellate.fadeIn);
    return constellate.magnitude * Easings.easeInOutCubic(progress);
};

export default class Sky extends AnimationManager {
    constructor(constellationBrightnessMap) {
        super();

        this.constellation = constellationBrightnessMap;
        this.stars = Array(count).fill().map(generateStar);
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    update(time, delta) {
        const { deltaX, deltaY, deltaZ } = getStarsTranslationVector(time, delta);
        const twinkleProbability = (delta > 1 ? 1 : delta) / twinkle.secondsPerOcurrence;
        const mapScale = getConstellationMagnitude(time);

        for(const star of this.stars) {
            star.translate(deltaX, deltaY, deltaZ);

            const twinkleAnimations = star.twinkle(twinkleProbability, twinkle.scaleMax, delta);
            this.addAnimations(twinkleAnimations);

            star.constellate(this.constellation, mapScale);
        }
        
        super.update();
    }

    setRenderingManager(manager) {
        this.manager = manager; // TODO invert control
        this.addStarsTo(manager.scene);
    }

    addStarsTo(scene) {
        for(const star of this.stars)
            scene.add(star.mesh);
    }
}

function getStarsTranslationVector(time, delta) {
    const prevPhase = Math.sin(2 * Math.PI * (time - delta) / starWave.period);
    const wavePhase = Math.sin(2 * Math.PI * time / starWave.period);
    const deltaPhase = wavePhase - prevPhase;

    const waveX = starWave.amplitude.x * deltaPhase;
    const waveY = starWave.amplitude.y * deltaPhase;
    const waveZ = starWave.amplitude.z * deltaPhase;

    const deltaX = starDrift.x * delta + waveX;
    const deltaY = starDrift.y * delta + waveY;
    const deltaZ = starDrift.z * delta + waveZ;

    return { deltaX, deltaY, deltaZ };
}

function generateStar() {
    const v = random(0, maxVolume);
    const z = getDistanceForVolume(v);
    
    const xyLimit = Math.sin(camera.fov) * (camera.distance + z);
    const x = random(-xyLimit, xyLimit);
    const y = random(-xyLimit, xyLimit);

    const star = new Star(x, y, z, camera, starDistance, twinkle);

    return star;
}

function getMaxVolume() {
    return getVolumeBetweenNearPlaneAndDistance(starDistance.max);
}

function getVolumeBetweenNearPlaneAndDistance(d) {
    return getVolumeFromCameraForDistance(               d) -
           getVolumeFromCameraForDistance(starDistance.min);
}

/**
 * @param {number} d 
 * @returns {number}
 */
function getVolumeFromCameraForDistance(d) {
    return                       1/3     * Math.pow(d, 3) +
                     camera.distance     * Math.pow(d, 2) +
            Math.pow(camera.distance, 2) *          d;
}

function getDistanceForVolume(v) {
    // t = "trueDistanceToNearPlane"
    const t = camera.distance + starDistance.min;

    return Math.cbrt(3 * v + Math.pow(t, 3)) - t + starDistance.min;
}