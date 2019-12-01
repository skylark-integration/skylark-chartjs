/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index"],function(e,r,o){"use strict";var exports={},module={exports:{}},t=e,i=r,s=o,n=s.valueOrDefault,l=t.global.defaultColor;function a(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var r;for(r in e)return!1;return!0}(e)}return t._set("global",{elements:{line:{tension:.4,backgroundColor:l,borderWidth:3,borderColor:l,borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",capBezierPoints:!0,fill:!0}}}),module.exports=i.extend({draw:function(){var e,r,o,i,l=this._view,a=this._chart.ctx,d=l.spanGaps,b=this._children.slice(),h=t.global,f=h.elements.line,p=-1;for(this._loop&&b.length&&b.push(b[0]),a.save(),a.lineCap=l.borderCapStyle||f.borderCapStyle,a.setLineDash&&a.setLineDash(l.borderDash||f.borderDash),a.lineDashOffset=n(l.borderDashOffset,f.borderDashOffset),a.lineJoin=l.borderJoinStyle||f.borderJoinStyle,a.lineWidth=n(l.borderWidth,f.borderWidth),a.strokeStyle=l.borderColor||h.defaultColor,a.beginPath(),p=-1,e=0;e<b.length;++e)r=b[e],o=s.previousItem(b,e),i=r._view,0===e?i.skip||(a.moveTo(i.x,i.y),p=e):(o=-1===p?o:b[p],i.skip||(p!==e-1&&!d||-1===p?a.moveTo(i.x,i.y):s.canvas.lineTo(a,o._view,r._view),p=e));a.stroke(),a.restore()}}),a(module.exports)?module.exports:a(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/elements/element.line.js.map
