import Easings from "./Easings.js";
import RenderingManager from "./RenderingManager.js";
import { currentTimeMillis } from "./util/Time.js";
import { Point3D } from "./util/Util.js";

export default class SpotlightManager {
    static LightsCount = 3;
    static ZDistance = 20;
    static OrbitPeriod = 3000;
    static OrbitRadius = 30;
    static RestAngle = 4 / 10 * Math.PI;

    constructor() {
        this.lights = [];
        this.target = new Point3D(0, 0, 0);

        for(let i = 0; i < SpotlightManager.LightsCount; i++) {
            const spotLight = new THREE.SpotLight( 0xffffff, 1 );
            this.lights.push( spotLight );
        }
    }

    lookAt(x, y, z) {
        this.target = new Point3D(x, y, z);
        this.updateLookAts();
    }

    setRenderingManager(renderingManager) {
        this.renderingManager = renderingManager;
        this.addComponentsTo(renderingManager);
    }

    update() {
        const time = currentTimeMillis();

        for(let i = 0; i < this.lights.length; i++) {
            const spotlight = this.lights[i];
            const rawAngle = (i / 16 / this.lights.length + time / SpotlightManager.OrbitPeriod);
            const angle = 2 * Math.PI * Easings.easeInOutExpo(rawAngle % 1, 30) + SpotlightManager.RestAngle;

            const radius = SpotlightManager.OrbitRadius;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
    
            spotlight.position.set( x, y, SpotlightManager.ZDistance );
        }

        this.updateLookAts();
    }

    updateLookAts() {
        for(const spotlight of this.lights)
            spotlight.lookAt(this.target.x, this.target.y, this.target.z);
    }

    /**
     * @param {RenderingManager} renderingManager 
     */
    addComponentsTo(renderingManager) {
        renderingManager.scene.addAll(this.getLights());
    }

    getLights() {
        return [...this.lights];
    }
}