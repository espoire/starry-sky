import RegularPolygon from "../geometry/RegularPolygon.js";
import { random } from "../util/Util.js";

const starGeometry = RegularPolygon.getGeometry(4);
const starMaterial = new THREE.MeshBasicMaterial({
    color: '#FFF',
    // wireframe: true
});

export default class Star {
    constructor(x, y, z, camera, starDistanceLimits) {
        this.camera = camera;
        this.starDistanceLimits = starDistanceLimits;

        this.mesh = generateMesh();
        this.limit = this.getLimit();
        this.setPosition(x, y, z);
    }

    getLimit() {
        const camera = this.camera;
        const z = this.z;

        return Math.sin(camera.fov) * (camera.distance + z)
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

    drift() {
        this.z -= 10;
        this.limit = this.getLimit();
        this.wrapZ();

        // this.x += 0.8;
        // this.y -= 0.2;

        // this.wrapX();
        // this.wrapY();

        this.syncGraphicsToPosition();
    }

    wrapX() {
        if(this.x < -this.limit) {
            this.x += 2 * this.limit;
        } else if(this.x > this.limit) {
            this.x -= 2 * this.limit;
        }
    }

    wrapY() {
        if(this.y < -this.limit) {
            this.y += 2 * this.limit;
        } else if(this.y > this.limit) {
            this.y -= 2 * this.limit;
        }
    }

    wrapZ() {
        const x = Math.abs(this.x);
        const y = Math.abs(this.y);
        const z =          this.z;

        if(x > this.limit || y > this.limit || z < this.starDistanceLimits.min) {
            this.z = this.starDistanceLimits.max;
            this.limit = this.getLimit();

            this.x = random(-this.limit, this.limit);
            this.y = random(-this.limit, this.limit);
        }
    }
}

function generateMesh() {
    return new THREE.Mesh(
        starGeometry,
        starMaterial
    );
}