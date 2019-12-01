/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index"],function(r,t,e){"use strict";var exports={},module={exports:{}},i=r,o=t,n=e,a=n.valueOrDefault,s=i.global.defaultColor;function u(r){var t=this._view;return!!t&&Math.abs(r-t.x)<t.radius+t.hitRadius}function d(r){return"object"!=typeof r||Array.isArray(r)||!function(r){var t;for(t in r)return!1;return!0}(r)}return i._set("global",{elements:{point:{radius:3,pointStyle:"circle",backgroundColor:s,borderColor:s,borderWidth:1,hitRadius:1,hoverRadius:4,hoverBorderWidth:1}}}),module.exports=o.extend({inRange:function(r,t){var e=this._view;return!!e&&Math.pow(r-e.x,2)+Math.pow(t-e.y,2)<Math.pow(e.hitRadius+e.radius,2)},inLabelRange:u,inXRange:u,inYRange:function(r){var t=this._view;return!!t&&Math.abs(r-t.y)<t.radius+t.hitRadius},getCenterPoint:function(){var r=this._view;return{x:r.x,y:r.y}},getArea:function(){return Math.PI*Math.pow(this._view.radius,2)},tooltipPosition:function(){var r=this._view;return{x:r.x,y:r.y,padding:r.radius+r.borderWidth}},draw:function(r){var t=this._view,e=this._chart.ctx,o=t.pointStyle,s=t.rotation,u=t.radius,d=t.x,l=t.y,h=i.global,c=h.defaultColor;t.skip||(void 0===r||n.canvas._isPointInArea(t,r))&&(e.strokeStyle=t.borderColor||c,e.lineWidth=a(t.borderWidth,h.elements.point.borderWidth),e.fillStyle=t.backgroundColor||c,n.canvas.drawPoint(e,o,u,d,l,s))}}),d(module.exports)?module.exports:d(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/elements/element.point.js.map
