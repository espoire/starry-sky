import { degreesToRadians } from "../util/Angle.js";
import { random } from "../util/Util.js";
import Star from "./Star.js";

const camera = {
    fov: degreesToRadians(45),
    distance: 20
};
const starDistance = {
    min: 0,
    max: 5000
};
const count = 20000;

export default class Sky {
    constructor() {
        this.stars = generateStars();
    }
    
    /**
     * @param {number} delta 
     *      The time elapsed since the last update in milliseconds.
     */
    update(delta) {
        for(const star of this.stars)
            star.drift();
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

function generateStars() {
    const ret = [];

    for(let i = 0; i < count; i++) {
        const star = generateStar();
        ret.push(star);
    }

    return ret;
}

function generateStar() {
    const maxXY = Math.sin(camera.fov) * (camera.distance + starDistance.max);

    while(true) {
        const x = random(-maxXY, maxXY);
        const y = random(-maxXY, maxXY);
        const z = random(starDistance.min, starDistance.max);

        const xyLimit = Math.sin(camera.fov) * (camera.distance + z);

        if(Math.abs(x) > xyLimit) continue;
        if(Math.abs(y) > xyLimit) continue;

        return new Star(x, y, z, camera, starDistance);
    }
}