export default class PieceType {
    static typesCounter = 0;
    static BY_ID = [];

    /**
     * @param {object} config
     * @param {function(): THREE.Mesh} config.meshGenerator
     * @param {function(THREE.Mesh): void} config.transform
     */
    constructor(config) {
        this.id = PieceType.typesCounter++;
        this.meshGenerator = config.meshGenerator;
        this.transform = config.transform;

        PieceType.BY_ID[this.id] = this;
    }

    /**
     * @param {number} id
     */
    static get(id) {
        return PieceType.BY_ID[id];
    }
}