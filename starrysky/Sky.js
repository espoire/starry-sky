import { degreesToRadians } from "../util/Angle.js";
import { random } from "../util/Util.js";
import Star from "./Star.js";
import AnimationManager from "../animations/AnimationManager.js";
import Interpolation from "../math/Interpolation.js";
import Easings from "../math/Easings.js";

// TODO convert settings to config object

const camera = {
    fov: degreesToRadians(20)
};
const starDistance = {
    min: 300,
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

            const twinkleAnimations = star.maybeTwinkle(twinkleProbability, twinkle.scaleMax, twinkle.durationMillis);
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
    
    const xyLimit = (z + starDistance.min) * Math.sin(camera.fov / 2);
    const x = random(-xyLimit, xyLimit);
    const y = random(-xyLimit, xyLimit);


    if(!x || !y || !z) {
        debugger;
        throw new Error();
    }

    const star = new Star({
        position: {
            x: x,
            y: y,
            z: z
        },
        frustum: {
            minZ: starDistance.min,
            maxZ: starDistance.max,
            angle: camera.fov
        }
    });

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
    return Math.pow(d, 3) / 3;
}

function getDistanceForVolume(v) {
    return Math.cbrt(3 * v + Math.pow(starDistance.min, 3));
}