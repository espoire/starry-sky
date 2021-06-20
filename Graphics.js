export default class Graphics {
    static getScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#113');
        scene.addAll(this.getLights());

        return scene;
    }

    static getCamera() {
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 20);
        camera.lookAt(0, 0, 0);

        return camera;
    }

    static getRenderer() {
        const renderer = new THREE.WebGLRenderer();
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