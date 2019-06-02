/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index"],function(t){"use strict";var r={},a={exports:{}},o=t;function e(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var r;for(r in t)return!1;return!0}(t)}return a.exports={formatters:{values:function(t){return o.isArray(t)?t:""+t},linear:function(t,r,a){var e=a.length>3?a[2]-a[1]:a[1]-a[0];Math.abs(e)>1&&t!==Math.floor(t)&&(e=t-Math.floor(t));var n=o.log10(Math.abs(e)),i="";if(0!==t)if(Math.max(Math.abs(a[0]),Math.abs(a[a.length-1]))<1e-4){var h=o.log10(Math.abs(t));i=t.toExponential(Math.floor(h)-Math.floor(n))}else{var l=-1*Math.floor(n);l=Math.max(Math.min(l,20),0),i=t.toFixed(l)}else i="0";return i},logarithmic:function(t,r,a){var e=t/Math.pow(10,Math.floor(o.log10(t)));return 0===t?"0":1===e||2===e||5===e||0===r||r===a.length-1?t.toExponential():""}}},e(a.exports)?a.exports:e(r)?r:void 0});
//# sourceMappingURL=../sourcemaps/core/core.ticks.js.map
