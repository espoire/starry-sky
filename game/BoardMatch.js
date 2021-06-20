import Animate from "../animations/Animate.js"
import MeshAnimation from "../animations/MeshAnimation.js";
import Board from "./Board.js";
import { array, compactSparseArray, removeMultipleIndexes } from "../util/Array.js";
import { GeneralSet, Point2D, random } from "../util/Util.js";

export default class BoardMatch {

    /** Accepts a map of the piece IDs in a game Board with
     * gaps left behind by breaking matches, returns a map of
     * how far the pieces should fall, in multiples of the
     * skyfallVector.
     * 
     * @param {(number | null)[][]} contents
     *      Board contents piece type IDs. -1 indicates an
     *      empty cell, null indicates a solid barrier.
     * @param {number} minLength
     *      The minimum number of consecutive pieces of the
     *      same type in a row required for a match to occur.
     * @returns {{
     *      matches: GeneralSet<Point2D>[],
     *      matchMap: (number | null)[]
     * }}
     *      A match information object containing a list of
     *      the matches found (array of sets of points), and
     *      a map of the board, listing which match a given
     *      location is part of.
     */
    static getMatchesInformation(contents, minLength) {
        const width = contents.length;
        const height = contents[0].length;

        /** @type {Point2D[]} */
        const matches = [];
        /** @type {(number | null)[]} */
        const matchMap = array(width, height).fillDeep(null);
        let combo = 0;

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const matchedPoints = BoardMatch.checkMatchAt(contents, x, y, minLength);
                if(!matchedPoints) continue;

                const matchedIds = new GeneralSet();
                for(const point of matchedPoints)
                    if(matchMap[point.x][point.y] != null)
                        matchedIds.add(matchMap[point.x][point.y]);
                
                if(matchedIds.size >= 2) {
                    // Connects more than one existing match.
                    // Merge all connected matches.

                    const multiMatchedIds = matchedIds.toArray();
                    const matchId = multiMatchedIds[0];
                    matches[matchId].addAll(matchedPoints);

                    let toDrop = [];
                    for(let i = 1; i < multiMatchedIds.length; i++) {
                        const id = multiMatchedIds[i];
                        const match = matches[id];

                        matches[matchId].addAll(match);
                        toDrop.push(id);
                    }

                    removeMultipleIndexes(matches, toDrop);

                    for(const point of matches[matchId].toArray())
                        matchMap[point.x][point.y] = matchId;
                    
                } else {
                    let matchId = null;

                    if(matchedIds.size == 0) {
                        // Connects to no existing match.
                        // New match.

                        matchId = combo++;
                        matches[matchId] = new GeneralSet();

                    } else if(matchedIds.size == 1) {
                        // Connects to one existing match.
                        // Add these pieces to existing.

                        matchId = matchedIds.getFirst();
                    }

                    matches[matchId].addAll(matchedPoints);

                    for(const point of matchedPoints)
                        matchMap[point.x][point.y] = matchId;
                }
            }
        }

        return {
            matches: compactSparseArray(matches),
            matchMap: matchMap
        };
    }

    /**
     * @param {number[][]} contents
     * @param {number} x
     * @param {number} y
     * @param {number} minLength The minimum match length
     * @returns {Point2D[] | null}
     *      A nonexhaustive list of points with which the given point
     *      matches, or null if no such points exist.
     */
    static checkMatchAt(contents, x, y, minLength) {
        const type = contents[x][y];

        let horizontal = [new Point2D(x, y)];
        for(let seekX = x + 1; seekX < contents.length; seekX++) {
            if(contents[seekX][y] != type) break;
            horizontal.push(new Point2D(seekX, y));
        }

        let vertical = [new Point2D(x, y)];
        for(let seekY = y + 1; seekY < contents[x].length; seekY++) {
            if(contents[x][seekY] != type) break;
            vertical.push(new Point2D(x, seekY));
        }

        if(horizontal.length < minLength && vertical.length < minLength)
            return null;
        
        let allMatches = new GeneralSet();
        if(horizontal.length >= minLength) allMatches.addAll(horizontal);
        if(vertical.length   >= minLength) allMatches.addAll(vertical);

        return allMatches.toArray();
    }

    /** Checks for matches, animates removing them,
     * refills the board, and cascades matches until
     * no new matches occur.
     * 
     * @param {Board} this
     */
    static clearMatches() {
        const contents = this.getContentsTypes();
        const minLength = this.minimumMatchLength;

        const matches = BoardMatch.getMatchesInformation(contents, minLength).matches;
        if(matches.length == 0) return;

        BoardMatch.animateMatchesRemoval(this, matches);
        this.onAnimationsDone(this.refill);
    }

    /** 
     * @param {Board} board
     * @param {GeneralSet<Point2D>[]} matches 
     */
    static animateMatchesRemoval(board, matches) {
        const scene = board.renderingManager.scene;

        let delay = 0;
        for(const match of matches) {
            for(const location of match.values()) {
                const removedPiece = board.clearCell(location.x, location.y);

                board.addAnimation(new MeshAnimation({
                    startDelay: delay,
                    duration: 1000,
                    mesh: removedPiece.mesh,
                    animation: [
                        Animate.mote(
                            random(-10, 10),
                            random( 10, 30),
                            random( 10, 30)
                        ),
                        Animate.accelerate( 0, -100, 0 ),
                        Animate.rotate(
                            random(-2, 2),
                            random(-2, 2),
                            random(-2, 2)
                        ),
                        Animate.removeFromScene(scene)
                    ]
                }));
            }
            delay += 250;
        }
    }
}