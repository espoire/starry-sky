export default class Highlighter {
    constructor() {
        this.current = {
            mesh: null,
            originalColor: null
        };

        this.meshSet = new Set();
        this.meshes = null;
    }

    updateHighlight(camera, mouse) {
        const intersects = mouse.getMouseovers(camera, this.getMeshes());

        if(intersects.length > 0) {
            const newHighlightMesh = intersects[0].object;
            this.setHighlight(newHighlightMesh);
        } else {
            this.clearHighlight();
        }
    }

    clearHighlight() {
        if(this.current.mesh) {
            this.current.mesh.material.color = this.current.originalColor;
            this.current.mesh = null;
            this.current.originalColor = null;
        }
    }

    setHighlight(mesh) {
        if(mesh != this.current.mesh) {
            this.clearHighlight();

            this.current.mesh = mesh;
            this.current.originalColor = mesh.material.color;
            mesh.material.color = new THREE.Color('#FFF');
        } 
    }

    

    addMesh(mesh) {
        this.meshSet.add(mesh);
        if(this.meshes && this.meshSet.size != this.meshes.length) this.meshes = null;
    }

    addMeshes(array) {
        for(const element of array) this.addMesh(element);
    }

    getMeshes() {
        if(!this.meshes) this.meshes = [...this.meshSet];
        return this.meshes;
    }
}