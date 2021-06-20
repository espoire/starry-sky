export default class BevelledRegularPolygon {
    static getGeometry(sides, bevel) {
        const scaleFactor = 1 + bevel;

        const faceZ = bevel / scaleFactor;
        const rearZ = -bevel / scaleFactor;
        
        const points = [];
        const faceCenter = [0, 0, faceZ];
        const rearCenter = [0, 0, rearZ];
        
        for(let i = 0; i < sides; i++) {
            const angle = 2 * Math.PI * i / sides;
            
            const x = Math.cos(angle) / scaleFactor;
            const y = Math.sin(angle) / scaleFactor;
            
            points.push({
                face: [x, y, faceZ],
                bevel: [x * (1 + bevel), y * (1 + bevel), 0],
                rear: [x, y, rearZ]
            });
        }
        
        const geometry = new THREE.BufferGeometry();
        
        const verts = [];
        
        for(let i = 0; i < sides; i++) {
            verts.push(
                ...points[i].face,
                ...points[i].bevel,
                ...points[i].rear
            );
        }
        verts.push(...faceCenter);
        verts.push(...rearCenter);
        
        const faceCenterIndex = 3 * sides;
        const rearCenterIndex = 3 * sides + 1;
        
        const index = [];
        
        for(let cur = 0; cur < sides; cur++) {
            const next = (cur + 1) % sides;
            
            const curFace  = cur * 3;
            const curBevel = cur * 3 + 1;
            const curRear  = cur * 3 + 2;
            const nextFace  = next * 3;
            const nextBevel = next * 3 + 1;
            const nextRear  = next * 3 + 2;
            
            index.push(
                // Face
                faceCenterIndex, curFace, nextFace,
                
                
                // Front Bevel
                curFace, curBevel, nextBevel,
                curFace, nextBevel, nextFace,
                
                // Rear Bevel
                curBevel, curRear, nextRear,
                curBevel, nextRear, nextBevel,
                
                // Rear
                rearCenterIndex, nextRear, curRear,
            );
        }
        
        geometry.setIndex(index);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geometry.computeVertexNormals();
        return geometry;
    }
}