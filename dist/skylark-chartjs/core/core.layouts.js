/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["./core.defaults","../helpers/index"],function(t,o){"use strict";var e={},i={exports:{}},r=o;function n(t,o){return r.where(t,function(t){return t.position===o})}function a(t,o){t.forEach(function(t,o){return t._tmpIndex_=o,t}),t.sort(function(t,e){var i=o?e:t,r=o?t:e;return i.weight===r.weight?i._tmpIndex_-r._tmpIndex_:i.weight-r.weight}),t.forEach(function(t){delete t._tmpIndex_})}function h(t,o){r.each(t,function(t){o[t.position]+=t.isHorizontal()?t.height:t.width})}function f(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var o;for(o in t)return!1;return!0}(t)}return t._set("global",{layout:{padding:{top:0,right:0,bottom:0,left:0}}}),i.exports={defaults:{},addBox:function(t,o){t.boxes||(t.boxes=[]),o.fullWidth=o.fullWidth||!1,o.position=o.position||"top",o.weight=o.weight||0,t.boxes.push(o)},removeBox:function(t,o){var e=t.boxes?t.boxes.indexOf(o):-1;-1!==e&&t.boxes.splice(e,1)},configure:function(t,o,e){for(var i,r=["fullWidth","position","weight"],n=r.length,a=0;a<n;++a)i=r[a],e.hasOwnProperty(i)&&(o[i]=e[i])},update:function(t,o,e){if(t){var i=t.options.layout||{},f=r.options.toPadding(i.padding),u=f.left,c=f.right,l=f.top,p=f.bottom,d=n(t.boxes,"left"),g=n(t.boxes,"right"),s=n(t.boxes,"top"),x=n(t.boxes,"bottom"),b=n(t.boxes,"chartArea");a(d,!0),a(g,!1),a(s,!0),a(x,!1);var m,v=d.concat(g),w=s.concat(x),M=v.concat(w),W=o-u-c,_=e-l-p,A=(o-W/2)/v.length,y=W,z=_,I={top:l,left:u,bottom:p,right:c},P=[];r.each(M,function(t){var o,e=t.isHorizontal();e?(o=t.update(t.fullWidth?W:y,_/2),z-=o.height):(o=t.update(A,z),y-=o.width),P.push({horizontal:e,width:o.width,box:t})}),m=function(t){var o=0,e=0,i=0,n=0;return r.each(t,function(t){if(t.getPadding){var r=t.getPadding();o=Math.max(o,r.top),e=Math.max(e,r.left),i=Math.max(i,r.bottom),n=Math.max(n,r.right)}}),{top:o,left:e,bottom:i,right:n}}(M),r.each(v,k),h(v,I),r.each(w,k),h(w,I),r.each(v,function(t){var o=r.findNextWhere(P,function(o){return o.box===t}),e={left:0,right:0,top:I.top,bottom:I.bottom};o&&t.update(o.width,z,e)}),h(M,I={top:l,left:u,bottom:p,right:c});var H=Math.max(m.left-I.left,0);I.left+=H,I.right+=Math.max(m.right-I.right,0);var B=Math.max(m.top-I.top,0);I.top+=B,I.bottom+=Math.max(m.bottom-I.bottom,0);var E=e-I.top-I.bottom,N=o-I.left-I.right;N===y&&E===z||(r.each(v,function(t){t.height=E}),r.each(w,function(t){t.fullWidth||(t.width=N)}),z=E,y=N);var O=u+H,j=l+B;r.each(d.concat(s),q),O+=y,j+=z,r.each(g,q),r.each(x,q),t.chartArea={left:I.left,top:I.top,right:I.left+y,bottom:I.top+z},r.each(b,function(o){o.left=t.chartArea.left,o.top=t.chartArea.top,o.right=t.chartArea.right,o.bottom=t.chartArea.bottom,o.update(y,z)})}function k(t){var o=r.findNextWhere(P,function(o){return o.box===t});if(o)if(o.horizontal){var e={left:Math.max(I.left,m.left),right:Math.max(I.right,m.right),top:0,bottom:0};t.update(t.fullWidth?W:y,_/2,e)}else t.update(o.width,z)}function q(t){t.isHorizontal()?(t.left=t.fullWidth?u:I.left,t.right=t.fullWidth?o-c:I.left+y,t.top=j,t.bottom=j+t.height,j=t.bottom):(t.left=O,t.right=O+t.width,t.top=I.top,t.bottom=I.top+z,O=t.right)}}},f(i.exports)?i.exports:f(e)?e:void 0});
//# sourceMappingURL=../sourcemaps/core/core.layouts.js.map
