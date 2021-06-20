import AnimationManager from "../animations/AnimationManager.js";
import { array, prettyPrint2DRectArray } from "../util/Array.js";
import BoardMatch from "./BoardMatch.js";
import BoardRefill from "./BoardRefill.js";
import Cell from "./Cell.js";
import Piece from "./Piece.js";

export default class Board extends AnimationManager {
    static AvailableTypes = 3;
    minimumMatchLength = 3;
    clearMatches = BoardMatch.clearMatches.bind(this);

    // #region Initialization

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;

        this.cellsMap = array(width, height);
        for(let x = 0; x < width; x++)
            for(let y = 0; y < height; y++)
                this.cellsMap[x][y] = new Cell(x, y);

        this.centerOn(0, 0, 0);
        
        this.printDebugInfo();
    }

    printDebugInfo() {
        console.log("");
        console.log("Debug: Board");
        console.log(this);
        console.log("");
        console.log(this.getContentsTypes());

        const contents = this.getContentsTypes();
        const minLength = this.minimumMatchLength;
        const matchesInfo = BoardMatch.getMatchesInformation(contents, minLength);
        console.log(matchesInfo);
        console.log("MatchMap pretty print");
        prettyPrint2DRectArray(matchesInfo.matchMap);
    }

    // #endregion

    // #region Contents Changers

    clearCell(x, y) {
        const cell = this.cellsMap[x][y];
        const removedPiece = cell.clear();

        return removedPiece;
    }

    refill() {
        const boardContents = this.getContentsTypes();

        const displacementMap = BoardRefill.getDisplacement(boardContents);
        const displacedContents = BoardRefill.applyDisplacement(boardContents, displacementMap);
        const refills = BoardRefill.fillBlanks(displacedContents);
        const finalContents = BoardRefill.applyRefills(displacedContents, refills);

        this.reload(finalContents);
        this.clearMatches();
    }

    /** Reloads the board with the specified piece type map.
     * 
     * @param {number[][]} types
     */
    reload(types) {
        const scene = this.renderingManager.scene;

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const cell = this.cellsMap[x][y];
                const oldTypeId = (cell.gem != null ? cell.gem.type.id : -1);
                const newTypeId = types[x][y];

                if(oldTypeId == newTypeId) continue;

                const oldPiece = cell.clear();
                if(oldPiece) scene.remove(oldPiece.mesh);

                const newPiece = cell.load(newTypeId);
                if(newPiece) scene.add(newPiece.mesh);
            }
        }
    }

    // #endregion

    // #region Rendering

    /** Centers the board's graphics on the given location.
     */
     centerOn(x, y, z) {
        const boardWidth = Cell.EdgeSize * this.width;
        const boardHeight = Cell.EdgeSize * this.height;
        
        const anchorX = Cell.EdgeSize / 2;
        const anchorY = Cell.EdgeSize / 2;

        const adjustX = anchorX - boardWidth / 2;
        const adjustY = anchorY - boardHeight / 2;

        this.setPosition(x + adjustX, y + adjustY, z);
    }

    setPosition(locX, locY, locZ) {
        for(const cell of this.getCells())
            try {
                cell.setPosition(locX, locY, locZ);
            } catch (err) {
                console.log(cell);
                throw err;
            }
    }

    setRenderingManager(renderingManager) {
        this.renderingManager = renderingManager;
        this.addComponentsTo(renderingManager);
    }

    /**
     * @param {RenderingManager} renderingManager 
     */
    addComponentsTo(renderingManager) {
        renderingManager.scene.addAll(this.getBoardMeshes());
        renderingManager.scene.addAll(this.getContentsMeshes());
        renderingManager.highlighter.addMeshes(this.getBoardMeshes());
    }

    // #endregion

    // #region Getters

    getCells() {
        const ret = [];

        for(let x = 0; x < this.width; x++)
            for(let y = 0; y < this.height; y++)
                ret.push(this.cellsMap[x][y]);

        return ret;
    }

    getBoardMeshes() {
        const ret = [];

        for(const cell of this.getCells())
            ret.push(cell.mesh);

        return ret;
    }

    getContentsMeshes() {
        const ret = [];

        for(const cell of this.getCells())
            ret.push(cell.gem.mesh);

        return ret;
    }

    /**
     * @returns {number[][]}
     *      A map of the piece types in this Board.
     *      -1 indicates an empty or missing cell.
     */
    getContentsTypes() {
        const ret = array(this.width, this.height).fillDeep(Piece.NULL_TYPE_ID);

        for(const cell of this.getCells())
            if(cell.gem)
                ret[cell.x][cell.y] = cell.gem.type.id;

        return ret;
    }

    // #endregion
}