/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./names"],function(r){var t={getRgba:n,getHsla:a,getRgb:function(r){var t=n(r);return t&&t.slice(0,3)},getHsl:function(r){var t=a(r);return t&&t.slice(0,3)},getHwb:e,getAlpha:function(r){var t=n(r);if(t)return t[3];if(t=a(r))return t[3];if(t=e(r))return t[3]},hexString:function(r,t){var t=void 0!==t&&3===r.length?t:r[3];return"#"+f(r[0])+f(r[1])+f(r[2])+(t>=0&&t<1?f(Math.round(255*t)):"")},rgbString:function(r,t){if(t<1||r[3]&&r[3]<1)return s(r,t);return"rgb("+r[0]+", "+r[1]+", "+r[2]+")"},rgbaString:s,percentString:function(r,t){if(t<1||r[3]&&r[3]<1)return i(r,t);var n=Math.round(r[0]/255*100),a=Math.round(r[1]/255*100),e=Math.round(r[2]/255*100);return"rgb("+n+"%, "+a+"%, "+e+"%)"},percentaString:i,hslString:function(r,t){if(t<1||r[3]&&r[3]<1)return o(r,t);return"hsl("+r[0]+", "+r[1]+"%, "+r[2]+"%)"},hslaString:o,hwbString:function(r,t){void 0===t&&(t=void 0!==r[3]?r[3]:1);return"hwb("+r[0]+", "+r[1]+"%, "+r[2]+"%"+(void 0!==t&&1!==t?", "+t:"")+")"},keyword:function(r){return d[r.slice(0,3)]}};function n(t){if(t){var n=[0,0,0],a=1,e=t.match(/^#([a-fA-F0-9]{3,4})$/i),s="";if(e){s=(e=e[1])[3];for(var i=0;i<n.length;i++)n[i]=parseInt(e[i]+e[i],16);s&&(a=Math.round(parseInt(s+s,16)/255*100)/100)}else if(e=t.match(/^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i)){s=e[2],e=e[1];for(i=0;i<n.length;i++)n[i]=parseInt(e.slice(2*i,2*i+2),16);s&&(a=Math.round(parseInt(s,16)/255*100)/100)}else if(e=t.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i)){for(i=0;i<n.length;i++)n[i]=parseInt(e[i+1]);a=parseFloat(e[4])}else if(e=t.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i)){for(i=0;i<n.length;i++)n[i]=Math.round(2.55*parseFloat(e[i+1]));a=parseFloat(e[4])}else if(e=t.match(/(\w+)/)){if("transparent"==e[1])return[0,0,0,0];if(!(n=r[e[1]]))return}for(i=0;i<n.length;i++)n[i]=u(n[i],0,255);return a=a||0==a?u(a,0,1):1,n[3]=a,n}}function a(r){if(r){var t=r.match(/^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/);if(t){var n=parseFloat(t[4]);return[u(parseInt(t[1]),0,360),u(parseFloat(t[2]),0,100),u(parseFloat(t[3]),0,100),u(isNaN(n)?1:n,0,1)]}}}function e(r){if(r){var t=r.match(/^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/);if(t){var n=parseFloat(t[4]);return[u(parseInt(t[1]),0,360),u(parseFloat(t[2]),0,100),u(parseFloat(t[3]),0,100),u(isNaN(n)?1:n,0,1)]}}}function s(r,t){return void 0===t&&(t=void 0!==r[3]?r[3]:1),"rgba("+r[0]+", "+r[1]+", "+r[2]+", "+t+")"}function i(r,t){return"rgba("+Math.round(r[0]/255*100)+"%, "+Math.round(r[1]/255*100)+"%, "+Math.round(r[2]/255*100)+"%, "+(t||r[3]||1)+")"}function o(r,t){return void 0===t&&(t=void 0!==r[3]?r[3]:1),"hsla("+r[0]+", "+r[1]+"%, "+r[2]+"%, "+t+")"}function u(r,t,n){return Math.min(Math.max(t,r),n)}function f(r){var t=r.toString(16).toUpperCase();return t.length<2?"0"+t:t}var d={};for(var h in r)d[r[h]]=h;return t});
//# sourceMappingURL=../sourcemaps/colors/strings.js.map