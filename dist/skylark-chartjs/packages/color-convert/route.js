/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
defin(["./conversions"],function(n){function t(t){const e=function(){const t={},e=Object.keys(n);for(let n=e.length,r=0;r<n;r++)t[e[r]]={distance:-1,parent:null};return t}(),r=[t];for(e[t].distance=0;r.length;){const t=r.pop(),c=Object.keys(n[t]);for(let n=c.length,o=0;o<n;o++){const n=c[o],s=e[n];-1===s.distance&&(s.distance=e[t].distance+1,s.parent=t,r.unshift(n))}}return e}function e(n,t){return function(e){return t(n(e))}}function r(t,r){const c=[r[t].parent,t];let o=n[r[t].parent][t],s=r[t].parent;for(;r[s].parent;)c.unshift(r[s].parent),o=e(n[r[s].parent][s],o),s=r[s].parent;return o.conversion=c,o}return function(n){const e=t(n),c={},o=Object.keys(e);for(let n=o.length,t=0;t<n;t++){const n=o[t];null!==e[n].parent&&(c[n]=r(n,e))}return c}});
//# sourceMappingURL=../../sourcemaps/packages/color-convert/route.js.map
