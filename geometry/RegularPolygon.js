import { unroll } from "../util/Array.js";

export default class RegularPolygon {
    static getGeometry(sides, includeRearFace = false) {
        const index = buildIndex(sides, includeRearFace);
        const verts = buildVerts(sides);

        const geometry = buildGeometry(index, verts);

        return geometry;
    }
}

/**
 * @param {number[]} index 
 * @param {number[]} verts 
 * @returns {THREE.BufferGeometry}
 */
function buildGeometry(index, verts) {
    const geometry = new THREE.BufferGeometry();

    geometry.setIndex(index);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geometry.computeVertexNormals();

    return geometry;
}

/**
 * @param {number} sides 
 * @returns {number[]}
 *      A collection of 3D points expressed as a liner
 *      one-dimensional array of numbers. Each set of
 *      three numbers describes one 3D point.
 */
function buildVerts(sides) {
    const points = buildPoints(sides);
    const verts = unroll(points);
    return verts;
}

/**
 * @param {number} sides 
 * @returns {number[][]}
 *      A collection of 3D points describing the
 *      vertices of a regular polygon.
 */
function buildPoints(sides) {
    const points = [];

    for (let i = 0; i < sides; i++) {
        const angle = 2 * Math.PI * i / sides;

        const x = Math.cos(angle);
        const y = Math.sin(angle);

        points.push([x, y, 0]);
    }

    return points;
}

/**
 * @param {number} sides
 * @param {boolean} includeRearFace
 * @returns {number[]}
 *      A one-dimensional array of vertex indices,
 *      describing triangles made by connecting
 *      three points.
 */
function buildIndex(sides, includeRearFace) {
    const index = [];

    for (let i = 0; i < sides - 1; i++) {
        const next = i % (sides - 1) + 1;

        index.push(
            // Face
            0, next, i
        );

        if (includeRearFace) index.push(
            // Rear
            0, i, next
        );
    }

    return index;
}