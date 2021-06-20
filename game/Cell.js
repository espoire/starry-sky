import BevelledRegularPolygon from "../BevelledRegularPolygon.js";
import Riches from "../Riches.js";
import { randInt } from "../util/Util.js";
import Board from "./Board.js";
import Piece from "./Piece.js";

export default class Cell {
    static _cellBevel = 0.3
    static _baseCellDiagonal = 2;
    static EdgeSize = 1;
    static CellScale = Math.sqrt(2) / this._baseCellDiagonal * this.EdgeSize;

    static CellGeometry = BevelledRegularPolygon.getGeometry(4, Cell._cellBevel);
    static CellColors = ['#0A0500', '#000000'];

    constructor(x, y) {
        this.x = x;
        this.y = y;

        const color = Cell.CellColors[(x + y) % 2];

        this.mesh = new THREE.Mesh(
            Cell.CellGeometry,
            new THREE.MeshPhysicalMaterial({
                color: color,
                reflectivity: 0,
                roughness: 1,
            })
        );

        const scale = Cell.CellScale;
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.rotation.z += Math.PI / 4;

        const gemType = Piece.randomType();
        this.load(gemType);

        this.setPosition(0, 0, 0);
    }

    /**
     * @param {number} gemType 
     * @returns {Piece}
     */
    load(gemType) {
        // TODO rename to piece
        this.gem = new Piece(gemType);
        this.positionGem();

        return this.gem;
    }

    setPosition(x, y, z) {
        this.mesh.position.set(this.x + x, this.y + y, z);
        this.positionGem();
    }

    positionGem() {
        let yOffset = 0;
        // if(this.gem.type.id === Piece.TYPES.GREEN_TRIANGLE.id) yOffset = 0.1;

        const x = this.mesh.position.x;
        const y = this.mesh.position.y + yOffset;
        const z = this.mesh.position.z + Cell._cellBevel * Cell.CellScale;

        this.gem.mesh.position.set(x, y, z);
    }

    /** Empties this cell and returns its Piece (if any).
     * 
     * @returns {Piece}
     */
    clear() {
        const ret = this.gem;
        this.gem = null;

        return ret;
    }

    getPiece() {
        return this.gem;
    }
}