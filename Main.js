import "../node_modules/three/build/three.js";
import "./overrides/JsExtensions.js";
import "./overrides/ThreeExtensions.js";
import StarrySkyInitializer from "./StarrySkyInitializer.js";

const animationManager = StarrySkyInitializer.initialize();
animationManager.display();