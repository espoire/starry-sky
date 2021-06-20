import Riches from "../Riches.js";
import { randInt } from "../util/Util.js";
import Board from "./Board.js";
import PieceType from "./PieceType.js";

export default class Piece {
    static NULL_TYPE_ID = -1;
    static TYPES = {
        GREEN_TRIANGLE: new PieceType ({
            meshGenerator: Riches.getGreenGemMesh
        }),
        BLUE_SQUARE: new PieceType ({
            meshGenerator: Riches.getBlueGemMesh
        }),
        RED_HEXAGON: new PieceType ({
            meshGenerator: Riches.getRedGemMesh
        }),
        GOLD_COIN: new PieceType ({
            meshGenerator: Riches.getGoldCoinMesh
        }),
        SILVER_COIN: new PieceType ({
            meshGenerator: Riches.getSilverCoinMesh,
            // transform: function (mesh) { mesh.rotation.z += Math.PI / 10; }
        }),
        BRONZE_TOKEN: new PieceType ({
            meshGenerator: Riches.getCopperCoinMesh
        })
    }

    static ContentsScale = 0.4;

    /**
     * @param {PieceType | number} type 
     */
    constructor(type) {
        if(typeof type === 'number')
            type = PieceType.get(type);

        this.type = type;
        this.mesh = Piece.generateMesh(type);
    }

    static generateMesh(type) {
        const mesh = type.meshGenerator();

        if(type.transform) type.transform(mesh);
        mesh.scale.set(Piece.ContentsScale, Piece.ContentsScale, Piece.ContentsScale);

        return mesh;
    }

    static randomType() {
        return randInt(0, Board.AvailableTypes - 1); // TODO move from Board
    }
}