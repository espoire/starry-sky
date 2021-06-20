export default class Mouse {
    constructor(element) {
        this.element = element;
        this.location = null;
        this.raycaster = new THREE.Raycaster();

        const me = this;
        this.element.addEventListener('mousemove', function(e) {
            me.updateMouseLocation(e);
        });
        this.element.addEventListener('mouseleave', function(e) {
            me.resetMouseLocation(e);
        });
    }

    updateMouseLocation(e) {
        if(!this.location) this.location = new THREE.Vector2();
        this.location.x = (e.x / this.element.innerWidth) * 2 - 1;
        this.location.y = -(e.y / this.element.innerHeight) * 2 + 1;
    }

    resetMouseLocation(e) {
        this.location = null;
    }

    /** @returns {object[]} Array of meshes which the mouse is
     *      pointing at, sorted from near to far, from among the
     *      meshes passed to setMeshes. Array elements take the
     *      following form:
     *          distance - distance from camera to intersection
     *          face - the triangle object it hit
     *          faceIndex
     *          object - the mesh it hit
     *          point - the 3d location of the intersection
     */
    getMouseovers(camera, meshes) {
        if(!this.location) return [];
        this.raycaster.setFromCamera(this.location, camera);
        var intersects = this.raycaster.intersectObjects(meshes);

        return intersects;
    }
}