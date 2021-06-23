import { ensureArray } from "../util/Array.js";
import { currentTimeMillis } from "../util/Time.js";

export default class MeshAnimation {
    /**
     * @param {object} config
     * @param {number} config.startDelay in millis
     * @param {number} config.duration in millis
     * @param {THREE.Mesh} config.mesh
     * @param {Animation | Animation[]} config.effect
     */
    constructor(config) {
        applyDefaultsTo(config);

        const time = currentTimeMillis();

        this.duration = config.duration;
        this.startTime = time + config.startDelay;
        this.endTime = this.startTime + this.duration;

        this.mesh = config.mesh;
        this.effects = ensureArray(config.effect);

        this.lastUpdated = time;
        this.isStarted = false;
        this.isEnded = false;
    }

    animate() {
        if(this.isEnded) throw new Error("Called animate() on an ended MeshAnimation.");

        const {time, delta, progress, start, end} = this.getStatus();
        this.lastUpdated = time;

        if(start)
            this.start();

        if(this.isStarted)
            this.step(delta, progress);

        if(end)
            this.end();
    }

    start() {
        for(const effect of this.effects)
            if(effect.start)
                effect.start(this.mesh);
        
        this.isStarted = true;
    }

    step(delta, progress) {
        for(const effect of this.effects)
            if(effect.step)
                effect.step(this.mesh, delta, progress);
    }

    end() {
        for(const effect of this.effects)
            if(effect.end)
                effect.end(this.mesh);
        
        this.isEnded = true;
    }

    /** Computes the status flags for this MeshAnimation
     * based on the system time.
     */
    getStatus() {
        const time = currentTimeMillis();
        let deltaMillis;
        let progress;
        let start = false;
        let end = false;

        if (time <= this.startTime) {
            deltaMillis = 0;
            progress = 0;

        } else {
            if(!this.isStarted) start = true;

            progress = (time - this.startTime) / this.duration;

            if (this.lastUpdated <= this.startTime) {
                deltaMillis = time - this.startTime;

            } else if (this.endTime < time) {
                if(!this.isEnded) end = true;
                deltaMillis = this.endTime - this.lastUpdated;
                progress = 1;

            } else {
                deltaMillis = time - this.lastUpdated;
            }
        }

        return {
            time: time,
            delta: deltaMillis / 1000,
            progress: progress,
            start: start,
            end: end
        };
    }
}


const configDefaults = {
    startDelay: 0,
    duration: 0
}

function applyDefaultsTo(config) {
    for(const key in configDefaults)
        if(config[key] == undefined)
            config[key] = configDefaults[key];
}