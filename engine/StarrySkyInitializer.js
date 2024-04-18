import Graphics from "./Graphics.js";
import RenderingManager from "./RenderingManager.js";
import Sky from "../geometry/Sky.js";
import { loadImageData } from "../util/File.js";
import { OrbitControls } from "../lib/OrbitControls.js";

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
                near: 50,
                far: 2000,
                angle: 30
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
        
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set(0, 0, -1300);
        manager.addSubmanager(controls);

        return manager;
    }
}