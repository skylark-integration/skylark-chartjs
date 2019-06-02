/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index"],function(r,t,e){"use strict";var i={},o={exports:{}},n=r,a=t,s=e,u=s.valueOrDefault,d=n.global.defaultColor;function l(r){var t=this._view;return!!t&&Math.abs(r-t.x)<t.radius+t.hitRadius}function h(r){return"object"!=typeof r||Array.isArray(r)||!function(r){var t;for(t in r)return!1;return!0}(r)}return n._set("global",{elements:{point:{radius:3,pointStyle:"circle",backgroundColor:d,borderColor:d,borderWidth:1,hitRadius:1,hoverRadius:4,hoverBorderWidth:1}}}),o.exports=a.extend({inRange:function(r,t){var e=this._view;return!!e&&Math.pow(r-e.x,2)+Math.pow(t-e.y,2)<Math.pow(e.hitRadius+e.radius,2)},inLabelRange:l,inXRange:l,inYRange:function(r){var t=this._view;return!!t&&Math.abs(r-t.y)<t.radius+t.hitRadius},getCenterPoint:function(){var r=this._view;return{x:r.x,y:r.y}},getArea:function(){return Math.PI*Math.pow(this._view.radius,2)},tooltipPosition:function(){var r=this._view;return{x:r.x,y:r.y,padding:r.radius+r.borderWidth}},draw:function(r){var t=this._view,e=this._chart.ctx,i=t.pointStyle,o=t.rotation,a=t.radius,d=t.x,l=t.y,h=n.global,c=h.defaultColor;t.skip||(void 0===r||s.canvas._isPointInArea(t,r))&&(e.strokeStyle=t.borderColor||c,e.lineWidth=u(t.borderWidth,h.elements.point.borderWidth),e.fillStyle=t.backgroundColor||c,s.canvas.drawPoint(e,i,a,d,l,o))}}),h(o.exports)?o.exports:h(i)?i:void 0});
//# sourceMappingURL=../sourcemaps/elements/element.point.js.map
