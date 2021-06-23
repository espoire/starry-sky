import Graphics from "./Graphics.js";
import RenderingManager from "./RenderingManager.js";
import Sky from "../starrysky/sky.js";
import Stats from "../../node_modules/stats.js/src/Stats.js";
import { loadImageData } from "../util/File.js";

const imageData = await loadImageData("./resources/star.png");
const twinkleMap = imageData.toBrightnessMap();

export default class StarrySkyInitializer {
    static initialize() {
        const scene = Graphics.getScene('#000');
        const camera = Graphics.getCamera();
        const renderer = Graphics.getRenderer();

        const manager = new RenderingManager(scene, camera, renderer);

        const sky = new Sky({
            stars: 6000,
            frustum: {
                near: 200,
                far: 2000,
                angle: 20
            },
            effects: {
                motion: { x: 4, y: 0, z: 0 },
                wave: {
                    amplitude: { x: 0, y: 10, z: 0 },
                    period: 15
                },
                twinkle: {
                    rate: 3,
                    magnitude: 10,
                    duration: 0.5,
                },
                constellation: {
                    delay: 2,
                    fadeIn: 4,
                    magnitude: 2,
                    image: twinkleMap
                }
            }
        });
        manager.addSubmanager(sky);

        const stats = createStats();
        manager.addSubmanager(stats);
        
        const controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.target.set(0, 0, -1300);
        manager.addSubmanager(controls);

        return manager;
    }
}

function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
    document.body.appendChild(stats.domElement);

    return stats;
}