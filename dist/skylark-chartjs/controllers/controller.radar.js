/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.datasetController","../core/core.defaults","../elements/index","../helpers/index"],function(o,e,t,r){"use strict";var n={},i={exports:{}},a=o,d=e,s=t,l=r,u=l.valueOrDefault,h=l.options.resolve;function p(o){return"object"!=typeof o||Array.isArray(o)||!function(o){var e;for(e in o)return!1;return!0}(o)}return d._set("radar",{scale:{type:"radialLinear"},elements:{line:{tension:0}}}),i.exports=a.extend({datasetElementType:s.Line,dataElementType:s.Point,linkScales:l.noop,update:function(o){var e,t,r=this,n=r.getMeta(),i=n.dataset,a=n.data||[],d=r.chart.scale,s=r.getDataset();for(void 0!==s.tension&&void 0===s.lineTension&&(s.lineTension=s.tension),i._scale=d,i._datasetIndex=r.index,i._children=a,i._loop=!0,i._model=r._resolveLineOptions(i),i.pivot(),e=0,t=a.length;e<t;++e)r.updateElement(a[e],e,o);for(r.updateBezierControlPoints(),e=0,t=a.length;e<t;++e)a[e].pivot()},updateElement:function(o,e,t){var r=this,n=o.custom||{},i=r.getDataset(),a=r.chart.scale,d=a.getPointPositionForValue(e,i.data[e]),s=r._resolvePointOptions(o,e),l=r.getMeta().dataset._model,h=t?a.xCenter:d.x,p=t?a.yCenter:d.y;o._scale=a,o._options=s,o._datasetIndex=r.index,o._index=e,o._model={x:h,y:p,skip:n.skip||isNaN(h)||isNaN(p),radius:s.radius,pointStyle:s.pointStyle,rotation:s.rotation,backgroundColor:s.backgroundColor,borderColor:s.borderColor,borderWidth:s.borderWidth,tension:u(n.tension,l?l.tension:0),hitRadius:s.hitRadius}},_resolvePointOptions:function(o,e){var t,r,n,i=this.chart,a=i.data.datasets[this.index],d=o.custom||{},s=i.options.elements.point,l={},u={chart:i,dataIndex:e,dataset:a,datasetIndex:this.index},p={backgroundColor:"pointBackgroundColor",borderColor:"pointBorderColor",borderWidth:"pointBorderWidth",hitRadius:"pointHitRadius",hoverBackgroundColor:"pointHoverBackgroundColor",hoverBorderColor:"pointHoverBorderColor",hoverBorderWidth:"pointHoverBorderWidth",hoverRadius:"pointHoverRadius",pointStyle:"pointStyle",radius:"pointRadius",rotation:"pointRotation"},c=Object.keys(p);for(t=0,r=c.length;t<r;++t)l[n=c[t]]=h([d[n],a[p[n]],a[n],s[n]],u,e);return l},_resolveLineOptions:function(o){var e,t,r,n=this.chart,i=n.data.datasets[this.index],a=o.custom||{},d=n.options.elements.line,s={},l=["backgroundColor","borderWidth","borderColor","borderCapStyle","borderDash","borderDashOffset","borderJoinStyle","fill"];for(e=0,t=l.length;e<t;++e)s[r=l[e]]=h([a[r],i[r],d[r]]);return s.tension=u(i.lineTension,d.tension),s},updateBezierControlPoints:function(){var o,e,t,r,n=this.getMeta(),i=this.chart.chartArea,a=n.data||[];function d(o,e,t){return Math.max(Math.min(o,t),e)}for(o=0,e=a.length;o<e;++o)t=a[o]._model,r=l.splineCurve(l.previousItem(a,o,!0)._model,t,l.nextItem(a,o,!0)._model,t.tension),t.controlPointPreviousX=d(r.previous.x,i.left,i.right),t.controlPointPreviousY=d(r.previous.y,i.top,i.bottom),t.controlPointNextX=d(r.next.x,i.left,i.right),t.controlPointNextY=d(r.next.y,i.top,i.bottom)},setHoverStyle:function(o){var e=o._model,t=o._options,r=l.getHoverColor;o.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth,radius:e.radius},e.backgroundColor=u(t.hoverBackgroundColor,r(t.backgroundColor)),e.borderColor=u(t.hoverBorderColor,r(t.borderColor)),e.borderWidth=u(t.hoverBorderWidth,t.borderWidth),e.radius=u(t.hoverRadius,t.radius)}}),p(i.exports)?i.exports:p(n)?n:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.radar.js.map