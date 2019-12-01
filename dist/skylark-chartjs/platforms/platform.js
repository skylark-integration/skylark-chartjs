/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index","./platform.basic","./platform.dom"],function(e,n,t){"use strict";var exports={},module={exports:{}},r=e,i=n,o=t,u=o._enabled?o:i;function f(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var n;for(n in e)return!1;return!0}(e)}return module.exports=r.extend({initialize:function(){},acquireContext:function(){},releaseContext:function(){},addEventListener:function(){},removeEventListener:function(){}},u),f(module.exports)?module.exports:f(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/platforms/platform.js.map
