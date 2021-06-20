import { degreesToRadians } from "../util/Angle.js";
import { random } from "../util/Util.js";
import Star from "./Star.js";
import AnimationManager from "../animations/AnimationManager.js";

const camera = {
    fov: degreesToRadians(45),
    distance: 20
};
const starDistance = {
    min: 0,
    max: 3000
};
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