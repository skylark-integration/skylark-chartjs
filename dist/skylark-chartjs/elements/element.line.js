/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index"],function(e,r,o){"use strict";var t={},i={exports:{}},s=e,n=r,l=o,a=l.valueOrDefault,d=s.global.defaultColor;function b(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var r;for(r in e)return!1;return!0}(e)}return s._set("global",{elements:{line:{tension:.4,backgroundColor:d,borderWidth:3,borderColor:d,borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",capBezierPoints:!0,fill:!0}}}),i.exports=n.extend({draw:function(){var e,r,o,t,i=this._view,n=this._chart.ctx,d=i.spanGaps,b=this._children.slice(),h=s.global,f=h.elements.line,p=-1;for(this._loop&&b.length&&b.push(b[0]),n.save(),n.lineCap=i.borderCapStyle||f.borderCapStyle,n.setLineDash&&n.setLineDash(i.borderDash||f.borderDash),n.lineDashOffset=a(i.borderDashOffset,f.borderDashOffset),n.lineJoin=i.borderJoinStyle||f.borderJoinStyle,n.lineWidth=a(i.borderWidth,f.borderWidth),n.strokeStyle=i.borderColor||h.defaultColor,n.beginPath(),p=-1,e=0;e<b.length;++e)r=b[e],o=l.previousItem(b,e),t=r._view,0===e?t.skip||(n.moveTo(t.x,t.y),p=e):(o=-1===p?o:b[p],t.skip||(p!==e-1&&!d||-1===p?n.moveTo(t.x,t.y):l.canvas.lineTo(n,o._view,r._view),p=e));n.stroke(),n.restore()}}),b(i.exports)?i.exports:b(t)?t:void 0});
//# sourceMappingURL=../sourcemaps/elements/element.line.js.map
