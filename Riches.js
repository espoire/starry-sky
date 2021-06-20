import BevelledRegularPolygon from "./BevelledRegularPolygon.js";

export default class Riches {
    /**
     * @param {number} sides 
     * @param {string} color Color hex code, like "#F80" for yellow.
     */
    static getGemMesh(sides, color, bevel = 0.3) {
    }

    static getCoinMesh(sides, color) {
        return new THREE.Mesh(
            BevelledRegularPolygon.getGeometry(sides, 0.05),
            new THREE.MeshPhysicalMaterial({
                color: color,
                reflectivity: 0.5,
                clearcoat: 0.2,
                roughness: 0.2,
                metalness: 0.8
            })
        );
    }

    static getRedGemMesh() {
        const sides = 6;
        const color = "#500";
        const bevel = 1;

        return new THREE.Mesh(
            BevelledRegularPolygon.getGeometry(sides, bevel),
            new THREE.MeshPhysicalMaterial({
                color: color,
                reflectivity: 0.5,
                clearcoat: 0.2,
                roughness: 0.2,
                metalness: 0.2,
                transmission: 0.25,
                

                flatShading: true,
                transparent: true,
                opacity: 0.70
            })
        );
    }

    static getGreenGemMesh() {
        const sides = 3;
        const color = "#080";
        const bevel = 50;

        const geometry = BevelledRegularPolygon.getGeometry(sides, bevel);
        geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( -0.25, 0, 0 ) );
        geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( -Math.PI / 2 ) );

        return new THREE.Mesh(
            geometry,
            new THREE.MeshPhysicalMaterial({
                color: color,
                reflectivity: 0.5,
                clearcoat: 0.2,
                roughness: 0.2,
                metalness: 0.2,
                transmission: 0.25,
                
                flatShading: true,
                transparent: true,
                opacity: 0.70
            })
        );
    }

    static getBlueGemMesh() {
        const sides = 4;
        const color = "#11F";
        const bevel = 0.3;

        const geometry = BevelledRegularPolygon.getGeometry(sides, bevel);
        geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( Math.PI / 4 ) );

        return new THREE.Mesh(
            geometry,
            new THREE.MeshPhysicalMaterial({
                color: color,
                reflectivity: 0.5,
                clearcoat: 0.2,
                roughness: 0.2,
                metalness: 0.2,
                transmission: 0.25,

                transparent: true,
                opacity: 0.70
            })
        );
    }

    static getGoldCoinMesh() {
        return Riches.getCoinMesh(16, "#FF0");
    }

    static getSilverCoinMesh() {
        return Riches.getCoinMesh(5, "#FFF");
    }

    static getCopperCoinMesh() {
        return Riches.getCoinMesh(4, "#F80");
    }
}