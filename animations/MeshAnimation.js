import { ensureArray } from "../util/Array.js";
import { currentTimeMillis } from "../util/Time.js";

export default class MeshAnimation {
    /**
     * @param {object} config
     * @param {number} config.startDelay in millis
     * @param {number} config.duration in millis
     * @param {THREE.Mesh} config.mesh
     * @param {Animation | Animation[]} config.animations
     */
    constructor(config) {
        const time = currentTimeMillis();

        this.startTime = time + config.startDelay;
        this.endTime = this.startTime + config.duration;
        this.mesh = config.mesh;
        this.animations = ensureArray(config.animation);

        this.lastUpdated = time;
        this.isStarted = false;
        this.isEnded = false;
    }

    animate() {
        if(this.isEnded) throw new Error("Called animate() on an ended MeshAnimation.");

        const {time, delta, start, end} = this.getStatus();
        this.lastUpdated = time;

        if(start)
            this.start();

        if(this.isStarted)
            this.step(delta);

        if(end)
            this.end();
    }

    start() {
        for(const animation of this.animations)
            if(animation.start)
                animation.start(this.mesh);
        
        this.isStarted = true;
    }

    step(delta) {
        for(const animation of this.animations)
            if(animation.step)
                animation.step(this.mesh, delta);
    }

    end() {
        for(const animation of this.animations)
            if(animation.end)
                animation.end(this.mesh);
        
        this.isEnded = true;
    }

    /** Computes the status flags for this MeshAnimation
     * based on the system time.
     */
    getStatus() {
        const time = currentTimeMillis();
        let deltaMillis;
        let start = false;
        let end = false;

        if (time <= this.startTime) {
            deltaMillis = 0;

        } else {
            if(!this.isStarted) start = true;

            if (this.lastUpdated <= this.startTime) {
                deltaMillis = time - this.startTime;

            } else if (this.endTime < time) {
                if(!this.isEnded) end = true;
                deltaMillis = this.endTime - this.lastUpdated;

            } else {
                deltaMillis = time - this.lastUpdated;
            }
        }

        return {
            time: time,
            delta: deltaMillis / 1000,
            start: start,
            end: end
        };
    }
}