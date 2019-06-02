/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","./helpers.core"],function(t,e){"use strict";var i={},r={exports:{}},n=t,o=e,l=o.valueOrDefault;function f(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return r.exports={toLineHeight:function(t,e){var i=(""+t).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t},toPadding:function(t){var e,i,r,n;return o.isObject(t)?(e=+t.top||0,i=+t.right||0,r=+t.bottom||0,n=+t.left||0):e=i=r=n=+t||0,{top:e,right:i,bottom:r,left:n,height:e+r,width:n+i}},_parseFont:function(t){var e=n.global,i=l(t.fontSize,e.defaultFontSize),r={family:l(t.fontFamily,e.defaultFontFamily),lineHeight:o.options.toLineHeight(l(t.lineHeight,e.defaultLineHeight),i),size:i,style:l(t.fontStyle,e.defaultFontStyle),weight:null,string:""};return r.string=function(t){return!t||o.isNullOrUndef(t.size)||o.isNullOrUndef(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}(r),r},resolve:function(t,e,i){var r,n,l;for(r=0,n=t.length;r<n;++r)if(void 0!==(l=t[r])&&(void 0!==e&&"function"==typeof l&&(l=l(e)),void 0!==i&&o.isArray(l)&&(l=l[i]),void 0!==l))return l}},f(r.exports)?r.exports:f(i)?i:void 0});
//# sourceMappingURL=../sourcemaps/helpers/helpers.options.js.map
