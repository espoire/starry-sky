import { degreesToRadians } from "../util/Angle.js";
import { random } from "../util/Util.js";
import Star from "./Star.js";
import AnimationManager from "../animations/AnimationManager.js";

const camera = {
    fov: degreesToRadians(20),
    distance: 20
};
const starDistance = {
    min: 100,
    max: 2000
};
const maxVolume = getMaxVolume();
const count = 6000;

export default class Sky extends AnimationManager {
    constructor() {
        super();
        this.stars = this.generateStars();
    }
    
    generateStars() {
        const ret = [];

        for(let i = 0; i < count; i++) {
            const star = generateStar();
            star.sky = this;
            ret.push(star);
        }

        console.log("Generated " + count + " stars, at z-depths [" +
            Math.floor(minZ) + " .. " + Math.floor(maxZ) + "].");

        return ret;
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    update(time, delta) {
        for(const star of this.stars)
            star.update(time, delta);
        
        super.update();
    }

    setRenderingManager(manager) {
        this.manager = manager;

        this.addStarsTo(manager.scene);
    }

    addStarsTo(scene) {
        for(const star of this.stars)
            scene.add(star.mesh);
    }
}

let minZ, maxZ;

function generateStar() {
    const v = random(0, maxVolume);
    const z = getDistanceForVolume(v);
    
    const xyLimit = Math.sin(camera.fov) * (camera.distance + z);
    const x = random(-xyLimit, xyLimit);
    const y = random(-xyLimit, xyLimit);

    const star = new Star(x, y, z, camera, starDistance);

    if(minZ == null || star.z < minZ) minZ = star.z;
    if(maxZ == null || star.z > maxZ) maxZ = star.z;

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