import { AmbientLight, Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";

export default class Graphics {
    /**
     * @param {string} backgroundColor
     *      A THREE js color string, like "#F08".
     * @returns {Scene}
     */
    static getScene(backgroundColor) {
        const scene = new Scene();
        scene.background = new Color(backgroundColor);
        scene.addAll(this.getLights());

        return scene;
    }

    static getCamera() {
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 10;
        const far = 5000;
        const camera = new PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, -1);

        return camera;
    }

    static getRenderer() {
        const renderer = new WebGLRenderer({
            antialias: true
        });

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        return renderer;
    }

    static getLights() {
        const ret = [];

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new AmbientLight(color, intensity);
        ret.push(light);

        return ret;
    }
}