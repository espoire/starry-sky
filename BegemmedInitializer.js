import Board from "./game/Board.js";
import Graphics from "./Graphics.js";
import Mouse from "./Mouse.js";
import RenderingManager from "./RenderingManager.js";
import SpotlightManager from "./SpotlightManager.js";

export default class BegemmedInitializer {
    static getGame() {
        const scene = Graphics.getScene();
        const camera = Graphics.getCamera();
        const renderer = Graphics.getRenderer();
        const mouse = new Mouse(window);

        const manager = new RenderingManager(scene, camera, renderer, mouse);

        const board = new Board(6, 12);
        manager.addSubmanager(board);

        const spotlights = new SpotlightManager();
        manager.addSubmanager(spotlights);

        return manager;
    }
}