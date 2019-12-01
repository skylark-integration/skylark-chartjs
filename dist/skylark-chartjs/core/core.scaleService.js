/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./core.defaults","../helpers/index","./core.layouts"],function(t,e,s){"use strict";var exports={},module={exports:{}},o=t,r=e,n=s;function i(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return module.exports={constructors:{},defaults:{},registerScaleType:function(t,e,s){this.constructors[t]=e,this.defaults[t]=r.clone(s)},getScaleConstructor:function(t){return this.constructors.hasOwnProperty(t)?this.constructors[t]:void 0},getScaleDefaults:function(t){return this.defaults.hasOwnProperty(t)?r.merge({},[o.scale,this.defaults[t]]):{}},updateScaleDefaults:function(t,e){this.defaults.hasOwnProperty(t)&&(this.defaults[t]=r.extend(this.defaults[t],e))},addScalesToLayout:function(t){r.each(t.scales,function(e){e.fullWidth=e.options.fullWidth,e.position=e.options.position,e.weight=e.options.weight,n.addBox(t,e)})}},i(module.exports)?module.exports:i(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/core/core.scaleService.js.map
