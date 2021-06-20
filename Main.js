import "./overrides/JsExtensions.js";
import "./overrides/ThreeExtensions.js";
import StarrySkyInitializer from "./StarrySkyInitializer.js";

const animationManager = StarrySkyInitializer.initialize();
animationManager.display();