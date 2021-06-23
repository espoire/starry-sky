import { currentTimeMillis } from "../util/Time.js";

export default class RenderingManager {
    subManagers = [];

    constructor(scene, camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
    }

    /**
     * @param {object} sub
     * @param {function} sub.update
     * @param {function} sub.getAllMeshes
     */
    addSubmanager(sub) {
        this.subManagers.push(sub);

        if(sub.getAllMeshes) sub.getAllMeshes().forEach(mesh => {
            this.scene.add(mesh);
        });
    }

    /**
     * @param {number} time 
     *      The total time elapsed in seconds.
     * @param {number} delta 
     *      The time elapsed since the last update in seconds.
     */
    update(time, delta) {
        for(const sub of this.subManagers)
            sub.update(time, delta);
    }

    display() {
        const self = this;

        const camera = this.camera;
        const renderer = this.renderer;
        const scene = this.scene;
        
        const startTime = currentTimeMillis() / 1000;
        let lastTime = currentTimeMillis() / 1000 - startTime;

        function renderLoop() {
            const time = currentTimeMillis() / 1000 - startTime;
            const delta = time - lastTime;

            requestAnimationFrame(renderLoop);

            self.update(time, delta);
            renderer.render( scene, camera );

            lastTime = time;
        }
        renderLoop();
    }
}