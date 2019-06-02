/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index","./platform.basic","./platform.dom"],function(e,n,t){"use strict";var r={},i={exports:{}},o=e,u=n,f=t,a=f._enabled?f:u;function c(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var n;for(n in e)return!1;return!0}(e)}return i.exports=o.extend({initialize:function(){},acquireContext:function(){},releaseContext:function(){},addEventListener:function(){},removeEventListener:function(){}},a),c(i.exports)?i.exports:c(r)?r:void 0});
//# sourceMappingURL=../sourcemaps/platforms/platform.js.map
