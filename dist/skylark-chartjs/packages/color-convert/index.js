/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./conversions","./route"],function(n,e){const o={};return Object.keys(n).forEach(t=>{o[t]={},Object.defineProperty(o[t],"channels",{value:n[t].channels}),Object.defineProperty(o[t],"labels",{value:n[t].labels});const c=e(t);Object.keys(c).forEach(n=>{const e=c[n];o[t][n]=function(n){const e=function(...e){const o=e[0];if(void 0===o||null===o)return o;o.length>1&&(e=o);const t=n(e);if("object"==typeof t)for(let n=t.length,e=0;e<n;e++)t[e]=Math.round(t[e]);return t};return"conversion"in n&&(e.conversion=n.conversion),e}(e),o[t][n].raw=function(n){const e=function(...e){const o=e[0];return void 0===o||null===o?o:(o.length>1&&(e=o),n(e))};return"conversion"in n&&(e.conversion=n.conversion),e}(e)})}),o});
//# sourceMappingURL=../../sourcemaps/packages/color-convert/index.js.map
