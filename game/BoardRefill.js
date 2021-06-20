import { array, prettyPrint2DRectArray } from "../util/Array.js";
import { Point2D } from "../util/Util.js";
import Piece from "./Piece.js";

export default class BoardRefill {
    static skyfallVector = new Point2D(0, -1);


    
    /** Accepts a map of the piece IDs in a game Board with
     * gaps left behind by breaking matches, returns a map of
     * how far the pieces should fall, in multiples of the
     * skyfallVector.
     * 
     * @param {(number | null)[][]} boardContents
     *      Board contents piece type IDs. -1 indicates an
     *      empty cell, null indicates a solid barrier.
     * @returns {(number | null)[][]}
     *      How far the pieces should fall, in multiples of
     *      the skyfallVector. Null for tiles which were empty
     *      in the first place.
     */
    static getDisplacement(boardContents) {
        const width = boardContents.length;
        const height = boardContents[0].length;
        const displacementMap = array(width, height).fillDeep(null);

        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                if(boardContents[x][y] == Piece.NULL_TYPE_ID) continue;

                let gapsCount = 0;
                let workingX = x;
                let workingY = y;

                while(0 <= workingX && workingX < width && 0 <= workingY && workingY < height && boardContents[workingX][workingY] != null) {
                    workingX += BoardRefill.skyfallVector.x;
                    workingY += BoardRefill.skyfallVector.y;

                    if(boardContents[workingX][workingY] === -1) gapsCount++;
                }

                displacementMap[x][y] = gapsCount;
            }
        }

        console.log("displacementMap");
        prettyPrint2DRectArray(displacementMap);

        return displacementMap;
    }



    /** Applies a displacement map to a board state, moving
     * some of the pieces, and filling in the empty spaces
     * with -1s.
     * 
     * @param {(number | null)[][]} boardContents
     *      Board contents piece type IDs. -1 indicates an
     *      empty cell, null indicates a solid barrier.
     * @param {(number | null)[][]} displacementMap 
     *      How far the pieces should fall, in multiples of
     *      the skyfallVector. Null for tiles which were empty
     *      in the first place.
     * @returns {(number | null)[][]}
     *      A new array containing board contents piece type
     *      IDs. -1 indicates an empty cell, null indicates a
     *      solid barrier.
     */
    static applyDisplacement(boardContents, displacementMap) {
        const width = boardContents.length;
        const height = boardContents[0].length;
        const newContents = array(width, height).fillDeep(Piece.NULL_TYPE_ID);

        // Iterate over area, displace existing values.
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                const displacement = displacementMap[x][y];
                if(displacement != null) {
                    const dx = BoardRefill.skyfallVector.x * displacement;
                    const dy = BoardRefill.skyfallVector.y * displacement;

                    newContents[x + dx][y + dy] = boardContents[x][y];
                }
                
                // Copy forward barriers
                if(boardContents[x][y] == null)
                    newContents[x][y] == boardContents[x][y];
            }
        }

        console.log("before refill");
        prettyPrint2DRectArray(newContents, Piece.NULL_TYPE_ID);
        
        return newContents;
    }



    /** Examines a board state for empty cells (-1) and returns
     * a map of new randomly chosen piece types to fill in those
     * blanks.
     * 
     * @param {(number | null)[][]} boardContents
     *      Board contents piece type IDs. -1 indicates an
     *      empty cell, null indicates a solid barrier.
     * @returns {(number | null)[][]}
     *      Refill piece type IDs, indicating which cells should
     *      change to which new piece. Null indicates no change.
     */
    static fillBlanks(boardContents) {
        const width = boardContents.length;
        const height = boardContents[0].length;
        const refills = array(width, height).fillDeep(null);

        for(let x = 0; x < width; x++)
            for(let y = 0; y < height; y++)
                if(boardContents[x][y] == Piece.NULL_TYPE_ID)
                    refills[x][y] = Piece.randomType();

        console.log("refills");
        prettyPrint2DRectArray(refills, Piece.NULL_TYPE_ID);

        return refills;
    }



    /** Applies a refill array to a board state, overwriting the
     * contents of the board state with the non-null contents of
     * the refill array.
     * 
     * @param {(number | null)[][]} boardContents 
     * @param {(number | null)[][]} refills 
     * @returns {(number | null)[][]}
     *      A new array containing board contents piece type
     *      IDs. Null indicates a solid barrier.
     */
    static applyRefills(boardContents, refills) {
        const width = boardContents.length;
        const height = boardContents[0].length;
        const newContents = array(width, height).fillDeep(null);

        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                if(refills[x][y] != null) {
                    newContents[x][y] = refills[x][y];
                } else {
                    newContents[x][y] = boardContents[x][y];
                }
            }
        }

        return newContents;
    }
}