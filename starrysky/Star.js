import RegularPolygon from "../geometry/RegularPolygon.js";
import { random, randomFromArray } from "../util/Util.js";
import MeshAnimation from "../animations/MeshAnimation.js";
import Animate from "../animations/Animate.js";

const starGeometry = RegularPolygon.getGeometry(4, true);
const starMaterial = new THREE.MeshBasicMaterial({
    color: '#FFF',
    // wireframe: true
});

export default class Star {
    constructor(x, y, z, camera, starDistanceLimits, twinkleProperties) {
        this.camera = camera;
        this.starDistanceLimits = starDistanceLimits;
        this.twinkleProperties = twinkleProperties;

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

    scale(scale) {
        this.mesh.scale.set(scale, scale, scale);
    }

    syncGraphicsToPosition() {
        this.mesh.position.set(this.x, this.y, -this.z);
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
     * @param {number} probability 
     *      The probability of starting a twinkle this frame.
     */
    twinkle(probability, magnitude, delta = 0) {
        this.isTwinkling -= delta;

        if(this.isTwinkling <= 0)
            if(Math.random() < probability)
                this.beginTwinkle(magnitude);
    }

    beginTwinkle(magnitude) {
        this.sky.addAnimation(new MeshAnimation({
            duration: this.twinkleProperties.durationMillis / 2,
            mesh: this.mesh,
            animation: Animate.scale(1, magnitude),
        }));
        this.sky.addAnimation(new MeshAnimation({
            startDelay: this.twinkleProperties.durationMillis / 2,
            duration: this.twinkleProperties.durationMillis / 2,
            mesh: this.mesh,
            animation: Animate.scale(magnitude, 1)
        }));

        this.isTwinkling = this.twinkleProperties.durationMillis / 1000;
    }

    getRelativeXY() {
        let x = (this.x / this.limit + 1) / 2;
        let y = (this.y / this.limit + 1) / 2;

        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > 0.999999) x = 0.999999;
        if(y > 0.999999) y = 0.999999;

        return {x, y};
    }
}

function generateMesh() {
    return new THREE.Mesh(
        starGeometry,
        starMaterial
    );
}