/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.datasetController","../core/core.defaults","../elements/index","../helpers/index"],function(t,e,a,r){"use strict";var o={},n={exports:{}},i=t,d=e,s=a,l=r,h=l.options.resolve,u=l.valueOrDefault;function c(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return d._set("doughnut",{animation:{animateRotate:!0,animateScale:!1},hover:{mode:"single"},legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');var a=t.data,r=a.datasets,o=a.labels;if(r.length)for(var n=0;n<r[0].data.length;++n)e.push('<li><span style="background-color:'+r[0].backgroundColor[n]+'"></span>'),o[n]&&e.push(o[n]),e.push("</li>");return e.push("</ul>"),e.join("")},legend:{labels:{generateLabels:function(t){var e=t.data;return e.labels.length&&e.datasets.length?e.labels.map(function(a,r){var o=t.getDatasetMeta(0),n=e.datasets[0],i=o.data[r],d=i&&i.custom||{},s=t.options.elements.arc;return{text:a,fillStyle:h([d.backgroundColor,n.backgroundColor,s.backgroundColor],void 0,r),strokeStyle:h([d.borderColor,n.borderColor,s.borderColor],void 0,r),lineWidth:h([d.borderWidth,n.borderWidth,s.borderWidth],void 0,r),hidden:isNaN(n.data[r])||o.data[r].hidden,index:r}}):[]}},onClick:function(t,e){var a,r,o,n=e.index,i=this.chart;for(a=0,r=(i.data.datasets||[]).length;a<r;++a)(o=i.getDatasetMeta(a)).data[n]&&(o.data[n].hidden=!o.data[n].hidden);i.update()}},cutoutPercentage:50,rotation:-.5*Math.PI,circumference:2*Math.PI,tooltips:{callbacks:{title:function(){return""},label:function(t,e){var a=e.labels[t.index],r=": "+e.datasets[t.datasetIndex].data[t.index];return l.isArray(a)?(a=a.slice())[0]+=r:a+=r,a}}}}),n.exports=i.extend({dataElementType:s.Arc,linkScales:l.noop,getRingIndex:function(t){for(var e=0,a=0;a<t;++a)this.chart.isDatasetVisible(a)&&++e;return e},update:function(t){var e,a,r=this,o=r.chart,n=o.chartArea,i=o.options,d=n.right-n.left,s=n.bottom-n.top,l=Math.min(d,s),h={x:0,y:0},u=r.getMeta(),c=u.data,g=i.cutoutPercentage,f=i.circumference,b=r._getRingWeight(r.index);if(f<2*Math.PI){var x=i.rotation%(2*Math.PI),M=(x+=2*Math.PI*(x>=Math.PI?-1:x<-Math.PI?1:0))+f,m={x:Math.cos(x),y:Math.sin(x)},v={x:Math.cos(M),y:Math.sin(M)},p=x<=0&&M>=0||x<=2*Math.PI&&2*Math.PI<=M,C=x<=.5*Math.PI&&.5*Math.PI<=M||x<=2.5*Math.PI&&2.5*Math.PI<=M,y=x<=-Math.PI&&-Math.PI<=M||x<=Math.PI&&Math.PI<=M,I=x<=.5*-Math.PI&&.5*-Math.PI<=M||x<=1.5*Math.PI&&1.5*Math.PI<=M,W=g/100,P={x:y?-1:Math.min(m.x*(m.x<0?1:W),v.x*(v.x<0?1:W)),y:I?-1:Math.min(m.y*(m.y<0?1:W),v.y*(v.y<0?1:W))},R={x:p?1:Math.max(m.x*(m.x>0?1:W),v.x*(v.x>0?1:W)),y:C?1:Math.max(m.y*(m.y>0?1:W),v.y*(v.y>0?1:W))},_={width:.5*(R.x-P.x),height:.5*(R.y-P.y)};l=Math.min(d/_.width,s/_.height),h={x:-.5*(R.x+P.x),y:-.5*(R.y+P.y)}}for(e=0,a=c.length;e<a;++e)c[e]._options=r._resolveElementOptions(c[e],e);for(o.borderWidth=r.getMaxBorderWidth(),o.outerRadius=Math.max((l-o.borderWidth)/2,0),o.innerRadius=Math.max(g?o.outerRadius/100*g:0,0),o.radiusLength=(o.outerRadius-o.innerRadius)/(r._getVisibleDatasetWeightTotal()||1),o.offsetX=h.x*o.outerRadius,o.offsetY=h.y*o.outerRadius,u.total=r.calculateTotal(),r.outerRadius=o.outerRadius-o.radiusLength*r._getRingWeightOffset(r.index),r.innerRadius=Math.max(r.outerRadius-o.radiusLength*b,0),e=0,a=c.length;e<a;++e)r.updateElement(c[e],e,t)},updateElement:function(t,e,a){var r=this,o=r.chart,n=o.chartArea,i=o.options,d=i.animation,s=(n.left+n.right)/2,h=(n.top+n.bottom)/2,u=i.rotation,c=i.rotation,g=r.getDataset(),f=a&&d.animateRotate?0:t.hidden?0:r.calculateCircumference(g.data[e])*(i.circumference/(2*Math.PI)),b=a&&d.animateScale?0:r.innerRadius,x=a&&d.animateScale?0:r.outerRadius,M=t._options||{};l.extend(t,{_datasetIndex:r.index,_index:e,_model:{backgroundColor:M.backgroundColor,borderColor:M.borderColor,borderWidth:M.borderWidth,borderAlign:M.borderAlign,x:s+o.offsetX,y:h+o.offsetY,startAngle:u,endAngle:c,circumference:f,outerRadius:x,innerRadius:b,label:l.valueAtIndexOrDefault(g.label,e,o.data.labels[e])}});var m=t._model;a&&d.animateRotate||(m.startAngle=0===e?i.rotation:r.getMeta().data[e-1]._model.endAngle,m.endAngle=m.startAngle+m.circumference),t.pivot()},calculateTotal:function(){var t,e=this.getDataset(),a=this.getMeta(),r=0;return l.each(a.data,function(a,o){t=e.data[o],isNaN(t)||a.hidden||(r+=Math.abs(t))}),r},calculateCircumference:function(t){var e=this.getMeta().total;return e>0&&!isNaN(t)?2*Math.PI*(Math.abs(t)/e):0},getMaxBorderWidth:function(t){var e,a,r,o,n,i,d,s,l=0,h=this.chart;if(!t)for(e=0,a=h.data.datasets.length;e<a;++e)if(h.isDatasetVisible(e)){t=(r=h.getDatasetMeta(e)).data,e!==this.index&&(n=r.controller);break}if(!t)return 0;for(e=0,a=t.length;e<a;++e)o=t[e],"inner"!==(i=n?n._resolveElementOptions(o,e):o._options).borderAlign&&(d=i.borderWidth,l=(s=i.hoverBorderWidth)>(l=d>l?d:l)?s:l);return l},setHoverStyle:function(t){var e=t._model,a=t._options,r=l.getHoverColor;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth},e.backgroundColor=u(a.hoverBackgroundColor,r(a.backgroundColor)),e.borderColor=u(a.hoverBorderColor,r(a.borderColor)),e.borderWidth=u(a.hoverBorderWidth,a.borderWidth)},_resolveElementOptions:function(t,e){var a,r,o,n=this.chart,i=this.getDataset(),d=t.custom||{},s=n.options.elements.arc,l={},u={chart:n,dataIndex:e,dataset:i,datasetIndex:this.index},c=["backgroundColor","borderColor","borderWidth","borderAlign","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth"];for(a=0,r=c.length;a<r;++a)l[o=c[a]]=h([d[o],i[o],s[o]],u,e);return l},_getRingWeightOffset:function(t){for(var e=0,a=0;a<t;++a)this.chart.isDatasetVisible(a)&&(e+=this._getRingWeight(a));return e},_getRingWeight:function(t){return Math.max(u(this.chart.data.datasets[t].weight,1),0)},_getVisibleDatasetWeightTotal:function(){return this._getRingWeightOffset(this.chart.data.datasets.length)}}),c(n.exports)?n.exports:c(o)?o:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.doughnut.js.map
