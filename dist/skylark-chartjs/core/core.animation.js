/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./core.element"],function(t){"use strict";var e={exports:{}},n=t.extend({chart:null,currentStep:0,numSteps:60,easing:"",render:null,onAnimationProgress:null,onAnimationComplete:null});function r(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return e.exports=n,Object.defineProperty(n.prototype,"animationObject",{get:function(){return this}}),Object.defineProperty(n.prototype,"chartInstance",{get:function(){return this.chart},set:function(t){this.chart=t}}),r(e.exports)?e.exports:r(n)?n:void 0});
//# sourceMappingURL=../sourcemaps/core/core.animation.js.map
