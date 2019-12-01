/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./core.defaults","../helpers/index"],function(n,t){"use strict";var exports={},module={exports:{}},i=t;function e(n){return"object"!=typeof n||Array.isArray(n)||!function(n){var t;for(t in n)return!1;return!0}(n)}return n._set("global",{animation:{duration:1e3,easing:"easeOutQuart",onProgress:i.noop,onComplete:i.noop}}),module.exports={animations:[],request:null,addAnimation:function(n,t,i,e){var a,r,o=this.animations;for(t.chart=n,t.startTime=Date.now(),t.duration=i,e||(n.animating=!0),a=0,r=o.length;a<r;++a)if(o[a].chart===n)return void(o[a]=t);o.push(t),1===o.length&&this.requestAnimationFrame()},cancelAnimation:function(n){var t=i.findIndex(this.animations,function(t){return t.chart===n});-1!==t&&(this.animations.splice(t,1),n.animating=!1)},requestAnimationFrame:function(){var n=this;null===n.request&&(n.request=i.requestAnimFrame.call(window,function(){n.request=null,n.startDigest()}))},startDigest:function(){this.advance(),this.animations.length>0&&this.requestAnimationFrame()},advance:function(){for(var n,t,e,a,r=this.animations,o=0;o<r.length;)t=(n=r[o]).chart,e=n.numSteps,a=Math.floor((Date.now()-n.startTime)/n.duration*e)+1,n.currentStep=Math.min(a,e),i.callback(n.render,[t,n],t),i.callback(n.onAnimationProgress,[n],t),n.currentStep>=e?(i.callback(n.onAnimationComplete,[n],t),t.animating=!1,r.splice(o,1)):++o}},e(module.exports)?module.exports:e(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/core/core.animations.js.map
