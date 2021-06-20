import { currentTimeMillis } from "./util/Time.js";

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
     * @param {function} sub.setRenderingManager
     */
    addSubmanager(sub) {
        this.subManagers.push(sub);

        if(sub.setRenderingManager)
            sub.setRenderingManager(this);
    }

    /**
     * @param {number} delta 
     *      The time elapsed since the last update in milliseconds.
     */
    update(delta) {
        for(const sub of this.subManagers)
            sub.update(delta);
    }

    display() {
        const renderManager = this;

        const camera = this.camera;
        const renderer = this.renderer;
        const scene = this.scene;
        
        let lastTime = currentTimeMillis();

        function renderLoop() {
            const time = currentTimeMillis();
            const delta = time - lastTime;

            requestAnimationFrame(renderLoop);

            renderManager.update(delta);
            renderer.render( scene, camera );

            lastTime = time;
        }
        renderLoop();
    }
}