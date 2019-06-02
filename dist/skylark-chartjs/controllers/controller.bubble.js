/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.datasetController","../core/core.defaults","../elements/index","../helpers/index"],function(e,o,r,t){"use strict";var a={},i={exports:{}},d=e,n=o,s=r,l=t,u=l.valueOrDefault,c=l.options.resolve;function x(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var o;for(o in e)return!1;return!0}(e)}return n._set("bubble",{hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-0"}],yAxes:[{type:"linear",position:"left",id:"y-axis-0"}]},tooltips:{callbacks:{title:function(){return""},label:function(e,o){var r=o.datasets[e.datasetIndex].label||"",t=o.datasets[e.datasetIndex].data[e.index];return r+": ("+e.xLabel+", "+e.yLabel+", "+t.r+")"}}}}),i.exports=d.extend({dataElementType:s.Point,update:function(e){var o=this,r=o.getMeta().data;l.each(r,function(r,t){o.updateElement(r,t,e)})},updateElement:function(e,o,r){var t=this,a=t.getMeta(),i=e.custom||{},d=t.getScaleForId(a.xAxisID),n=t.getScaleForId(a.yAxisID),s=t._resolveElementOptions(e,o),l=t.getDataset().data[o],u=t.index,c=r?d.getPixelForDecimal(.5):d.getPixelForValue("object"==typeof l?l:NaN,o,u),x=r?n.getBasePixel():n.getPixelForValue(l,o,u);e._xScale=d,e._yScale=n,e._options=s,e._datasetIndex=u,e._index=o,e._model={backgroundColor:s.backgroundColor,borderColor:s.borderColor,borderWidth:s.borderWidth,hitRadius:s.hitRadius,pointStyle:s.pointStyle,rotation:s.rotation,radius:r?0:s.radius,skip:i.skip||isNaN(c)||isNaN(x),x:c,y:x},e.pivot()},setHoverStyle:function(e){var o=e._model,r=e._options,t=l.getHoverColor;e.$previousStyle={backgroundColor:o.backgroundColor,borderColor:o.borderColor,borderWidth:o.borderWidth,radius:o.radius},o.backgroundColor=u(r.hoverBackgroundColor,t(r.backgroundColor)),o.borderColor=u(r.hoverBorderColor,t(r.borderColor)),o.borderWidth=u(r.hoverBorderWidth,r.borderWidth),o.radius=r.radius+r.hoverRadius},_resolveElementOptions:function(e,o){var r,t,a,i=this.chart,d=i.data.datasets[this.index],n=e.custom||{},s=i.options.elements.point,l=d.data[o],u={},x={chart:i,dataIndex:o,dataset:d,datasetIndex:this.index},b=["backgroundColor","borderColor","borderWidth","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth","hoverRadius","hitRadius","pointStyle","rotation"];for(r=0,t=b.length;r<t;++r)u[a=b[r]]=c([n[a],d[a],s[a]],x,o);return u.radius=c([n.radius,l?l.r:void 0,d.radius,s.radius],x,o),u}}),x(i.exports)?i.exports:x(a)?a:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.bubble.js.map