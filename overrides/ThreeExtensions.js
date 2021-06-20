(function() {
    THREE.Object3D.prototype.addAll = function(x) {
        if(Array.isArray(x)) {
            for(const element of x)
                this.add(element);
        } else {
            this.add(x);
        }
    };
})();