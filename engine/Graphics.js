export default class Graphics {
    /**
     * @param {string} backgroundColor
     *      A THREE.js color string, like "#F08".
     * @returns {THREE.Scene}
     */
    static getScene(backgroundColor) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        scene.addAll(this.getLights());

        return scene;
    }

    static getCamera() {
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 20;
        const far = 5020;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 1);

        return camera;
    }

    static getRenderer() {
        const renderer = new THREE.WebGLRenderer({
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
        const light = new THREE.AmbientLight(color, intensity);
        ret.push(light);

        return ret;
    }
}