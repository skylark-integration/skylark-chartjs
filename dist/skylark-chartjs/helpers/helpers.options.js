/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","./helpers.core"],function(t,e){"use strict";var exports={},module={exports:{}},i=t,r=e,n=r.valueOrDefault;function o(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return module.exports={toLineHeight:function(t,e){var i=(""+t).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t},toPadding:function(t){var e,i,n,o;return r.isObject(t)?(e=+t.top||0,i=+t.right||0,n=+t.bottom||0,o=+t.left||0):e=i=n=o=+t||0,{top:e,right:i,bottom:n,left:o,height:e+n,width:o+i}},_parseFont:function(t){var e=i.global,o=n(t.fontSize,e.defaultFontSize),l={family:n(t.fontFamily,e.defaultFontFamily),lineHeight:r.options.toLineHeight(n(t.lineHeight,e.defaultLineHeight),o),size:o,style:n(t.fontStyle,e.defaultFontStyle),weight:null,string:""};return l.string=function(t){return!t||r.isNullOrUndef(t.size)||r.isNullOrUndef(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}(l),l},resolve:function(t,e,i){var n,o,l;for(n=0,o=t.length;n<o;++n)if(void 0!==(l=t[n])&&(void 0!==e&&"function"==typeof l&&(l=l(e)),void 0!==i&&r.isArray(l)&&(l=l[i]),void 0!==l))return l}},o(module.exports)?module.exports:o(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/helpers/helpers.options.js.map
