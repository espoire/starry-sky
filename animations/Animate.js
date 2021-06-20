/** Collection of static factory methods that create
 * animation configs for the MeshAnimation class.
 */
export default class Animate {
    static mote(velocityX, velocityY, velocityZ) {
        return {
            step: function (mesh, delta) {
                const x = mesh.position.x;
                const y = mesh.position.y;
                const z = mesh.position.z;
                
                const deltaX = velocityX * delta;
                const deltaY = velocityY * delta;
                const deltaZ = velocityZ * delta;

                mesh.position.set(x + deltaX, y + deltaY, z + deltaZ);
            }
        };
    }

    static accelerate(accelX, accelY, accelZ) {
        let velocityX = 0;
        let velocityY = 0;
        let velocityZ = 0;

        return {
            step: function (mesh, delta) {
                const x = mesh.position.x;
                const y = mesh.position.y;
                const z = mesh.position.z;

                velocityX += accelX * delta;
                velocityY += accelY * delta;
                velocityZ += accelZ * delta;
                
                const deltaX = velocityX * delta;
                const deltaY = velocityY * delta;
                const deltaZ = velocityZ * delta;

                mesh.position.set(x + deltaX, y + deltaY, z + deltaZ);
            }
        };
    }

    static rotate(spinX, spinY, spinZ) {
        return {
            step: function (mesh, delta) {
                mesh.rotation.x += spinX * 2 * Math.PI * delta;
                mesh.rotation.y += spinY * 2 * Math.PI * delta;
                mesh.rotation.z += spinZ * 2 * Math.PI * delta;
            }
        };
    }

    static removeFromScene(scene) {
        return {
            end: function (mesh) {
                scene.remove(mesh);
            }
        };
    }
}