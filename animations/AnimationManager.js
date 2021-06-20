import MeshAnimation from "./MeshAnimation.js";

export default class AnimationManager {
    /** @type {MeshAnimation[]} */
    animations = [];

    /** @type {function[]} */
    whenDoneCallbacks = [];

    /**
     * @param {MeshAnimation} animation 
     */
    addAnimation(animation) {
        this.animations.push(animation);
    }

    /**
     * @param {function} callback 
     */
    onAnimationsDone(callback) {
        this.whenDoneCallbacks.push(callback);
    }

    update() {
        if(this.animations.length == 0) return;

        for(let i = 0; i < this.animations.length; i++) {
            const animation = this.animations[i];
            animation.animate();

            if(animation.isEnded) this.animations.splice(i--, 1);
        }

        if(this.animations.length == 0) this.runDoneCallbacks();
    }

    runDoneCallbacks() {
        const toCall = this.whenDoneCallbacks;
        this.whenDoneCallbacks = [];

        for(const callback of toCall) callback.call(this);
    }
}