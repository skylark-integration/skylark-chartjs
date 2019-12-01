/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index"],function(t){"use strict";var exports={},module={exports:{}},r=t;function a(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var r;for(r in t)return!1;return!0}(t)}return module.exports={formatters:{values:function(t){return r.isArray(t)?t:""+t},linear:function(t,a,o){var e=o.length>3?o[2]-o[1]:o[1]-o[0];Math.abs(e)>1&&t!==Math.floor(t)&&(e=t-Math.floor(t));var n=r.log10(Math.abs(e)),i="";if(0!==t)if(Math.max(Math.abs(o[0]),Math.abs(o[o.length-1]))<1e-4){var h=r.log10(Math.abs(t));i=t.toExponential(Math.floor(h)-Math.floor(n))}else{var l=-1*Math.floor(n);l=Math.max(Math.min(l,20),0),i=t.toFixed(l)}else i="0";return i},logarithmic:function(t,a,o){var e=t/Math.pow(10,Math.floor(r.log10(t)));return 0===t?"0":1===e||2===e||5===e||0===a||a===o.length-1?t.toExponential():""}}},a(module.exports)?module.exports:a(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/core/core.ticks.js.map
