import Graphics from "./Graphics.js";
import RenderingManager from "./RenderingManager.js";
import Sky from "./starrysky/sky.js";
import Stats from "../node_modules/stats.js/src/Stats.js";

export default class StarrySkyInitializer {
    static initialize() {
        const scene = Graphics.getScene('#000');
        const camera = Graphics.getCamera();
        const renderer = Graphics.getRenderer();

        const manager = new RenderingManager(scene, camera, renderer);

        const sky = new Sky();
        manager.addSubmanager(sky);

        const stats = createStats();
        document.body.appendChild(stats.domElement);
        manager.addSubmanager(stats);

        return manager;
    }
}

function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
  }