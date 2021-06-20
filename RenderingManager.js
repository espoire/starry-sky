import Highlighter from "./Highlighter.js";

export default class RenderingManager {
    subManagers = [];

    constructor(scene, camera, renderer, mouse) {
        this.camera = camera;
        this.highlighter = new Highlighter();
        this.mouse = mouse;
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
        sub.setRenderingManager(this);
    }

    update() {
        for(const sub of this.subManagers) sub.update();
    }

    display() {
        const renderManager = this;

        const camera = this.camera;
        const highlighter = this.highlighter;
        const mouse = this.mouse;
        const renderer = this.renderer;
        const scene = this.scene;

        function renderLoop() {
            requestAnimationFrame(renderLoop);

            renderManager.update();
            highlighter.updateHighlight(camera, mouse);
            renderer.render( scene, camera );
        }
        renderLoop();
    }
}