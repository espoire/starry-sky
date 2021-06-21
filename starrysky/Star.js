import RegularPolygon from "../geometry/RegularPolygon.js";
import { random, randomFromArray } from "../util/Util.js";
import MeshAnimation from "../animations/MeshAnimation.js";
import Animate from "../animations/Animate.js";

const starGeometry = RegularPolygon.getGeometry(4);
const starMaterial = new THREE.MeshBasicMaterial({
    color: '#FFF',
    // wireframe: true
});

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
    durationMillis: 500
}

export default class Star {
    constructor(x, y, z, camera, starDistanceLimits) {
        this.camera = camera;
        this.starDistanceLimits = starDistanceLimits;

        this.mesh = generateMesh();

        this.setPosition(x, y, z);
        this.limit = this.getLimit();

        this.size = 1;
        this.isTwinkling = 0;
    }

    getLimit() {
        const camera = this.camera;
        const z = this.z;

        return Math.sin(camera.fov / 2) * (camera.distance + z)
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.syncGraphicsToPosition();
    }

    syncGraphicsToPosition() {
        this.mesh.position.set(this.x, this.y, -this.z);
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    update(time, delta) {
        this.drift(time, delta);
        this.twinkle(delta);
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    drift(time, delta) {
        const prevPhase = Math.sin(2 * Math.PI * (time - delta) / starWave.period)
        const wavePhase = Math.sin(2 * Math.PI * time / starWave.period);
        const deltaPhase = wavePhase - prevPhase;

        const waveX = starWave.amplitude.x * deltaPhase;
        const waveY = starWave.amplitude.y * deltaPhase;
        const waveZ = starWave.amplitude.z * deltaPhase;

        const deltaX = starDrift.x * delta + waveX;
        const deltaY = starDrift.y * delta + waveY;
        const deltaZ = starDrift.z * delta + waveZ;

        this.translate(deltaX, deltaY, deltaZ);
    }

    translate(deltaX, deltaY, deltaZ) {
        if(deltaZ != 0) {
            this.z += deltaZ;
            this.limit = this.getLimit();
            this.wrapZ();
        }

        if(deltaX != 0) {
            this.x += deltaX;
            this.wrapX();
        }

        if(deltaY != 0) {
            this.y += deltaY;
            this.wrapY();
        }

        this.syncGraphicsToPosition();
    }

    wrapX() {
        if(this.x < -this.limit) {
            while(this.x < -this.limit)
                this.x += 2 * this.limit;
        } else if(this.x > this.limit) {
            while(this.x > this.limit)
                this.x -= 2 * this.limit;
        }
    }

    wrapY() {
        if(this.y < -this.limit) {
            while(this.y < -this.limit)
                this.y += 2 * this.limit;
        } else if(this.y > this.limit) {
            while(this.y > this.limit)
                this.y -= 2 * this.limit;
        }
    }

    wrapZ() {
        const x = Math.abs(this.x);
        const y = Math.abs(this.y);
        const z =          this.z;

        if(x > this.limit || y > this.limit || z < this.starDistanceLimits.min) {
            // Note: this code doesn't work right.
            // Not fixing now because it's not in use anyway.
            console.log("Wrapped front to back.");

            this.z += this.starDistanceLimits.max - this.starDistanceLimits.min;
            this.limit = this.getLimit();

            this.x = random(-this.limit, this.limit);
            this.y = random(-this.limit, this.limit);
        } else if(z > this.starDistanceLimits.max) {
            this.z -= this.starDistanceLimits.max - this.starDistanceLimits.min;
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
     * @param {number} time 
     *      The total time elapsed in seconds.
     */
    twinkle(delta) {
        this.isTwinkling -= delta;

        if(this.isTwinkling <= 0) {
            if(delta > 1) delta = 1;
            const probability = delta / twinkle.secondsPerOcurrence;

            if(Math.random() < probability) {
                this.beginTwinkle();
            }
        }
    }

    beginTwinkle() {
        this.sky.addAnimation(new MeshAnimation({
            duration: twinkle.durationMillis / 2,
            mesh: this.mesh,
            animation: Animate.scale(1, twinkle.scaleMax),
        }));
        this.sky.addAnimation(new MeshAnimation({
            startDelay: twinkle.durationMillis / 2,
            duration: twinkle.durationMillis / 2,
            mesh: this.mesh,
            animation: Animate.scale(twinkle.scaleMax, 1)
        }));

        this.isTwinkling = twinkle.durationMillis / 1000;
    }
}

function generateMesh() {
    return new THREE.Mesh(
        starGeometry,
        starMaterial
    );
}