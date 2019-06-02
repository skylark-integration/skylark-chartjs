/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["./color-name"],function(r){function t(t){if(t){var n=[0,0,0],a=1,e=t.match(/^#([a-fA-F0-9]{3,4})$/i),s="";if(e){s=(e=e[1])[3];for(var i=0;i<n.length;i++)n[i]=parseInt(e[i]+e[i],16);s&&(a=Math.round(parseInt(s+s,16)/255*100)/100)}else if(e=t.match(/^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i)){s=e[2],e=e[1];for(i=0;i<n.length;i++)n[i]=parseInt(e.slice(2*i,2*i+2),16);s&&(a=Math.round(parseInt(s,16)/255*100)/100)}else if(e=t.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i)){for(i=0;i<n.length;i++)n[i]=parseInt(e[i+1]);a=parseFloat(e[4])}else if(e=t.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i)){for(i=0;i<n.length;i++)n[i]=Math.round(2.55*parseFloat(e[i+1]));a=parseFloat(e[4])}else if(e=t.match(/(\w+)/)){if("transparent"==e[1])return[0,0,0,0];if(!(n=r[e[1]]))return}for(i=0;i<n.length;i++)n[i]=o(n[i],0,255);return a=a||0==a?o(a,0,1):1,n[3]=a,n}}function n(r){if(r){var t=r.match(/^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/);if(t){var n=parseFloat(t[4]);return[o(parseInt(t[1]),0,360),o(parseFloat(t[2]),0,100),o(parseFloat(t[3]),0,100),o(isNaN(n)?1:n,0,1)]}}}function a(r){if(r){var t=r.match(/^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/);if(t){var n=parseFloat(t[4]);return[o(parseInt(t[1]),0,360),o(parseFloat(t[2]),0,100),o(parseFloat(t[3]),0,100),o(isNaN(n)?1:n,0,1)]}}}function e(r,t){return void 0===t&&(t=void 0!==r[3]?r[3]:1),"rgba("+r[0]+", "+r[1]+", "+r[2]+", "+t+")"}function s(r,t){return"rgba("+Math.round(r[0]/255*100)+"%, "+Math.round(r[1]/255*100)+"%, "+Math.round(r[2]/255*100)+"%, "+(t||r[3]||1)+")"}function i(r,t){return void 0===t&&(t=void 0!==r[3]?r[3]:1),"hsla("+r[0]+", "+r[1]+"%, "+r[2]+"%, "+t+")"}function o(r,t,n){return Math.min(Math.max(t,r),n)}function u(r){var t=r.toString(16).toUpperCase();return t.length<2?"0"+t:t}var f={};for(var d in r)f[r[d]]=d;return{getRgba:t,getHsla:n,getRgb:function(r){var n=t(r);return n&&n.slice(0,3)},getHsl:function(r){var t=n(r);return t&&t.slice(0,3)},getHwb:a,getAlpha:function(r){var e=t(r);return e?e[3]:(e=n(r))?e[3]:(e=a(r))?e[3]:void 0},hexString:function(r,t){return t=void 0!==t&&3===r.length?t:r[3],"#"+u(r[0])+u(r[1])+u(r[2])+(t>=0&&t<1?u(Math.round(255*t)):"")},rgbString:function(r,t){return t<1||r[3]&&r[3]<1?e(r,t):"rgb("+r[0]+", "+r[1]+", "+r[2]+")"},rgbaString:e,percentString:function(r,t){return t<1||r[3]&&r[3]<1?s(r,t):"rgb("+Math.round(r[0]/255*100)+"%, "+Math.round(r[1]/255*100)+"%, "+Math.round(r[2]/255*100)+"%)"},percentaString:s,hslString:function(r,t){return t<1||r[3]&&r[3]<1?i(r,t):"hsl("+r[0]+", "+r[1]+"%, "+r[2]+"%)"},hslaString:i,hwbString:function(r,t){return void 0===t&&(t=void 0!==r[3]?r[3]:1),"hwb("+r[0]+", "+r[1]+"%, "+r[2]+"%"+(void 0!==t&&1!==t?", "+t:"")+")"},keyword:function(r){return f[r.slice(0,3)]}}});
//# sourceMappingURL=../sourcemaps/packages/chartjs-color-string.js.map
