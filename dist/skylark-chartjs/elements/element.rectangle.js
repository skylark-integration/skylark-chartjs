/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index"],function(t,e,r){"use strict";var n={},o={exports:{}},i=t,a=e,l=r,u=i.global.defaultColor;function h(t){return t&&void 0!==t.width}function s(t){var e,r,n,o,i;return h(t)?(i=t.width/2,e=t.x-i,r=t.x+i,n=Math.min(t.y,t.base),o=Math.max(t.y,t.base)):(i=t.height/2,e=Math.min(t.x,t.base),r=Math.max(t.x,t.base),n=t.y-i,o=t.y+i),{left:e,top:n,right:r,bottom:o}}function b(t,e,r){return t===e?r:t===r?e:t}function f(t,e,r){var n,o,i,a,u=t.borderWidth,h=function(t){var e=t.borderSkipped,r={};return e?(t.horizontal?t.base>t.x&&(e=b(e,"left","right")):t.base<t.y&&(e=b(e,"bottom","top")),r[e]=!0,r):r}(t);return l.isObject(u)?(n=+u.top||0,o=+u.right||0,i=+u.bottom||0,a=+u.left||0):n=o=i=a=+u||0,{t:h.top||n<0?0:n>r?r:n,r:h.right||o<0?0:o>e?e:o,b:h.bottom||i<0?0:i>r?r:i,l:h.left||a<0?0:a>e?e:a}}function c(t,e,r){var n=null===e,o=null===r,i=!(!t||n&&o)&&s(t);return i&&(n||e>=i.left&&e<=i.right)&&(o||r>=i.top&&r<=i.bottom)}function v(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return i._set("global",{elements:{rectangle:{backgroundColor:u,borderColor:u,borderSkipped:"bottom",borderWidth:0}}}),o.exports=a.extend({draw:function(){var t=this._chart.ctx,e=this._view,r=function(t){var e=s(t),r=e.right-e.left,n=e.bottom-e.top,o=f(t,r/2,n/2);return{outer:{x:e.left,y:e.top,w:r,h:n},inner:{x:e.left+o.l,y:e.top+o.t,w:r-o.l-o.r,h:n-o.t-o.b}}}(e),n=r.outer,o=r.inner;t.fillStyle=e.backgroundColor,t.fillRect(n.x,n.y,n.w,n.h),n.w===o.w&&n.h===o.h||(t.save(),t.beginPath(),t.rect(n.x,n.y,n.w,n.h),t.clip(),t.fillStyle=e.borderColor,t.rect(o.x,o.y,o.w,o.h),t.fill("evenodd"),t.restore())},height:function(){var t=this._view;return t.base-t.y},inRange:function(t,e){return c(this._view,t,e)},inLabelRange:function(t,e){var r=this._view;return h(r)?c(r,t,null):c(r,null,e)},inXRange:function(t){return c(this._view,t,null)},inYRange:function(t){return c(this._view,null,t)},getCenterPoint:function(){var t,e,r=this._view;return h(r)?(t=r.x,e=(r.y+r.base)/2):(t=(r.x+r.base)/2,e=r.y),{x:t,y:e}},getArea:function(){var t=this._view;return h(t)?t.width*Math.abs(t.y-t.base):t.height*Math.abs(t.x-t.base)},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y}}}),v(o.exports)?o.exports:v(n)?n:void 0});
//# sourceMappingURL=../sourcemaps/elements/element.rectangle.js.map