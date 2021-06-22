import { ensureArray } from "../util/Array.js";
import MeshAnimation from "./MeshAnimation.js";

export default class AnimationManager {
    /** @type {MeshAnimation[]} */
    animations = [];

    /** @type {function[]} */
    whenDoneCallbacks = [];

    /**
     * @param {MeshAnimation[]} animations 
     */
    addAnimations(animations) {
        animations = ensureArray(animations);

        for(const animation of animations)
            this.animations.push(animation);
    }

    update() {
        if(this.animations.length == 0) return;

        for(let i = 0; i < this.animations.length; i++) {
            const animation = this.animations[i];
            animation.animate();

            if(animation.isEnded) this.animations.splice(i--, 1);
        }
    }
}