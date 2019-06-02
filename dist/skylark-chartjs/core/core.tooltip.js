/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["./core.defaults","./core.element","../helpers/index"],function(t,e,o){"use strict";var i={},n={exports:{}},r=t,l=e,a=o,d=a.valueOrDefault;r._set("global",{tooltips:{enabled:!0,custom:null,mode:"nearest",position:"average",intersect:!0,backgroundColor:"rgba(0,0,0,0.8)",titleFontStyle:"bold",titleSpacing:2,titleMarginBottom:6,titleFontColor:"#fff",titleAlign:"left",bodySpacing:2,bodyFontColor:"#fff",bodyAlign:"left",footerFontStyle:"bold",footerSpacing:2,footerMarginTop:6,footerFontColor:"#fff",footerAlign:"left",yPadding:6,xPadding:6,caretPadding:2,caretSize:5,cornerRadius:6,multiKeyBackground:"#fff",displayColors:!0,borderColor:"rgba(0,0,0,0)",borderWidth:0,callbacks:{beforeTitle:a.noop,title:function(t,e){var o="",i=e.labels,n=i?i.length:0;if(t.length>0){var r=t[0];r.label?o=r.label:r.xLabel?o=r.xLabel:n>0&&r.index<n&&(o=i[r.index])}return o},afterTitle:a.noop,beforeBody:a.noop,beforeLabel:a.noop,label:function(t,e){var o=e.datasets[t.datasetIndex].label||"";return o&&(o+=": "),a.isNullOrUndef(t.value)?o+=t.yLabel:o+=t.value,o},labelColor:function(t,e){var o=e.getDatasetMeta(t.datasetIndex).data[t.index]._view;return{borderColor:o.borderColor,backgroundColor:o.backgroundColor}},labelTextColor:function(){return this._options.bodyFontColor},afterLabel:a.noop,afterBody:a.noop,beforeFooter:a.noop,footer:a.noop,afterFooter:a.noop}}});var f={average:function(t){if(!t.length)return!1;var e,o,i=0,n=0,r=0;for(e=0,o=t.length;e<o;++e){var l=t[e];if(l&&l.hasValue()){var a=l.tooltipPosition();i+=a.x,n+=a.y,++r}}return{x:i/r,y:n/r}},nearest:function(t,e){var o,i,n,r=e.x,l=e.y,d=Number.POSITIVE_INFINITY;for(o=0,i=t.length;o<i;++o){var f=t[o];if(f&&f.hasValue()){var c=f.getCenterPoint(),y=a.distanceBetweenPoints(e,c);y<d&&(d=y,n=f)}}if(n){var g=n.tooltipPosition();r=g.x,l=g.y}return{x:r,y:l}}};function c(t,e){return e&&(a.isArray(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function y(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\n")>-1?t.split("\n"):t}function g(t){var e=r.global;return{xPadding:t.xPadding,yPadding:t.yPadding,xAlign:t.xAlign,yAlign:t.yAlign,bodyFontColor:t.bodyFontColor,_bodyFontFamily:d(t.bodyFontFamily,e.defaultFontFamily),_bodyFontStyle:d(t.bodyFontStyle,e.defaultFontStyle),_bodyAlign:t.bodyAlign,bodyFontSize:d(t.bodyFontSize,e.defaultFontSize),bodySpacing:t.bodySpacing,titleFontColor:t.titleFontColor,_titleFontFamily:d(t.titleFontFamily,e.defaultFontFamily),_titleFontStyle:d(t.titleFontStyle,e.defaultFontStyle),titleFontSize:d(t.titleFontSize,e.defaultFontSize),_titleAlign:t.titleAlign,titleSpacing:t.titleSpacing,titleMarginBottom:t.titleMarginBottom,footerFontColor:t.footerFontColor,_footerFontFamily:d(t.footerFontFamily,e.defaultFontFamily),_footerFontStyle:d(t.footerFontStyle,e.defaultFontStyle),footerFontSize:d(t.footerFontSize,e.defaultFontSize),_footerAlign:t.footerAlign,footerSpacing:t.footerSpacing,footerMarginTop:t.footerMarginTop,caretSize:t.caretSize,cornerRadius:t.cornerRadius,backgroundColor:t.backgroundColor,opacity:0,legendColorBackground:t.multiKeyBackground,displayColors:t.displayColors,borderColor:t.borderColor,borderWidth:t.borderWidth}}function h(t,e){return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-t.xPadding:t.x+t.xPadding}function s(t){return c([],y(t))}function u(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return(i=l.extend({initialize:function(){this._model=g(this._options),this._lastActive=[]},getTitle:function(){var t=this._options.callbacks,e=t.beforeTitle.apply(this,arguments),o=t.title.apply(this,arguments),i=t.afterTitle.apply(this,arguments),n=[];return n=c(n=c(n=c(n,y(e)),y(o)),y(i))},getBeforeBody:function(){return s(this._options.callbacks.beforeBody.apply(this,arguments))},getBody:function(t,e){var o=this,i=o._options.callbacks,n=[];return a.each(t,function(t){var r={before:[],lines:[],after:[]};c(r.before,y(i.beforeLabel.call(o,t,e))),c(r.lines,i.label.call(o,t,e)),c(r.after,y(i.afterLabel.call(o,t,e))),n.push(r)}),n},getAfterBody:function(){return s(this._options.callbacks.afterBody.apply(this,arguments))},getFooter:function(){var t=this._options.callbacks,e=t.beforeFooter.apply(this,arguments),o=t.footer.apply(this,arguments),i=t.afterFooter.apply(this,arguments),n=[];return n=c(n=c(n=c(n,y(e)),y(o)),y(i))},update:function(t){var e,o,i,n,r,l,d,c,y,h,s=this,u=s._options,b=s._model,p=s._model=g(u),x=s._active,F=s._data,v={xAlign:b.xAlign,yAlign:b.yAlign},S={x:b.x,y:b.y},_={width:b.width,height:b.height},A={x:b.caretX,y:b.caretY};if(x.length){p.opacity=1;var C=[],m=[];A=f[u.position].call(s,x,s._eventPosition);var w=[];for(e=0,o=x.length;e<o;++e)w.push((i=x[e],n=void 0,r=void 0,void 0,void 0,c=void 0,y=void 0,h=void 0,n=i._xScale,r=i._yScale||i._scale,l=i._index,d=i._datasetIndex,c=i._chart.getDatasetMeta(d).controller,y=c._getIndexScale(),h=c._getValueScale(),{xLabel:n?n.getLabelForIndex(l,d):"",yLabel:r?r.getLabelForIndex(l,d):"",label:y?""+y.getLabelForIndex(l,d):"",value:h?""+h.getLabelForIndex(l,d):"",index:l,datasetIndex:d,x:i._model.x,y:i._model.y}));u.filter&&(w=w.filter(function(t){return u.filter(t,F)})),u.itemSort&&(w=w.sort(function(t,e){return u.itemSort(t,e,F)})),a.each(w,function(t){C.push(u.callbacks.labelColor.call(s,t,s._chart)),m.push(u.callbacks.labelTextColor.call(s,t,s._chart))}),p.title=s.getTitle(w,F),p.beforeBody=s.getBeforeBody(w,F),p.body=s.getBody(w,F),p.afterBody=s.getAfterBody(w,F),p.footer=s.getFooter(w,F),p.x=A.x,p.y=A.y,p.caretPadding=u.caretPadding,p.labelColors=C,p.labelTextColors=m,p.dataPoints=w,S=function(t,e,o,i){var n=t.x,r=t.y,l=t.caretSize,a=t.caretPadding,d=t.cornerRadius,f=o.xAlign,c=o.yAlign,y=l+a,g=d+a;return"right"===f?n-=e.width:"center"===f&&((n-=e.width/2)+e.width>i.width&&(n=i.width-e.width),n<0&&(n=0)),"top"===c?r+=y:r-="bottom"===c?e.height+y:e.height/2,"center"===c?"left"===f?n+=y:"right"===f&&(n-=y):"left"===f?n-=g:"right"===f&&(n+=g),{x:n,y:r}}(p,_=function(t,e){var o=t._chart.ctx,i=2*e.yPadding,n=0,r=e.body,l=r.reduce(function(t,e){return t+e.before.length+e.lines.length+e.after.length},0);l+=e.beforeBody.length+e.afterBody.length;var d=e.title.length,f=e.footer.length,c=e.titleFontSize,y=e.bodyFontSize,g=e.footerFontSize;i+=d*c,i+=d?(d-1)*e.titleSpacing:0,i+=d?e.titleMarginBottom:0,i+=l*y,i+=l?(l-1)*e.bodySpacing:0,i+=f?e.footerMarginTop:0,i+=f*g,i+=f?(f-1)*e.footerSpacing:0;var h=0,s=function(t){n=Math.max(n,o.measureText(t).width+h)};return o.font=a.fontString(c,e._titleFontStyle,e._titleFontFamily),a.each(e.title,s),o.font=a.fontString(y,e._bodyFontStyle,e._bodyFontFamily),a.each(e.beforeBody.concat(e.afterBody),s),h=e.displayColors?y+2:0,a.each(r,function(t){a.each(t.before,s),a.each(t.lines,s),a.each(t.after,s)}),h=0,o.font=a.fontString(g,e._footerFontStyle,e._footerFontFamily),a.each(e.footer,s),{width:n+=2*e.xPadding,height:i}}(this,p),v=function(t,e){var o,i,n,r,l,a=t._model,d=t._chart,f=t._chart.chartArea,c="center",y="center";a.y<e.height?y="top":a.y>d.height-e.height&&(y="bottom");var g=(f.left+f.right)/2,h=(f.top+f.bottom)/2;"center"===y?(o=function(t){return t<=g},i=function(t){return t>g}):(o=function(t){return t<=e.width/2},i=function(t){return t>=d.width-e.width/2}),n=function(t){return t+e.width+a.caretSize+a.caretPadding>d.width},r=function(t){return t-e.width-a.caretSize-a.caretPadding<0},l=function(t){return t<=h?"top":"bottom"},o(a.x)?(c="left",n(a.x)&&(c="center",y=l(a.y))):i(a.x)&&(c="right",r(a.x)&&(c="center",y=l(a.y)));var s=t._options;return{xAlign:s.xAlign?s.xAlign:c,yAlign:s.yAlign?s.yAlign:y}}(this,_),s._chart)}else p.opacity=0;return p.xAlign=v.xAlign,p.yAlign=v.yAlign,p.x=S.x,p.y=S.y,p.width=_.width,p.height=_.height,p.caretX=A.x,p.caretY=A.y,s._model=p,t&&u.custom&&u.custom.call(s,p),s},drawCaret:function(t,e){var o=this._chart.ctx,i=this._view,n=this.getCaretPosition(t,e,i);o.lineTo(n.x1,n.y1),o.lineTo(n.x2,n.y2),o.lineTo(n.x3,n.y3)},getCaretPosition:function(t,e,o){var i,n,r,l,a,d,f=o.caretSize,c=o.cornerRadius,y=o.xAlign,g=o.yAlign,h=t.x,s=t.y,u=e.width,b=e.height;if("center"===g)a=s+b/2,"left"===y?(n=(i=h)-f,r=i,l=a+f,d=a-f):(n=(i=h+u)+f,r=i,l=a-f,d=a+f);else if("left"===y?(i=(n=h+c+f)-f,r=n+f):"right"===y?(i=(n=h+u-c-f)-f,r=n+f):(i=(n=o.caretX)-f,r=n+f),"top"===g)a=(l=s)-f,d=l;else{a=(l=s+b)+f,d=l;var p=r;r=i,i=p}return{x1:i,x2:n,x3:r,y1:l,y2:a,y3:d}},drawTitle:function(t,e,o){var i=e.title;if(i.length){t.x=h(e,e._titleAlign),o.textAlign=e._titleAlign,o.textBaseline="top";var n,r,l=e.titleFontSize,d=e.titleSpacing;for(o.fillStyle=e.titleFontColor,o.font=a.fontString(l,e._titleFontStyle,e._titleFontFamily),n=0,r=i.length;n<r;++n)o.fillText(i[n],t.x,t.y),t.y+=l+d,n+1===i.length&&(t.y+=e.titleMarginBottom-d)}},drawBody:function(t,e,o){var i,n=e.bodyFontSize,r=e.bodySpacing,l=e._bodyAlign,d=e.body,f=e.displayColors,c=e.labelColors,y=0,g=f?h(e,"left"):0;o.textAlign=l,o.textBaseline="top",o.font=a.fontString(n,e._bodyFontStyle,e._bodyFontFamily),t.x=h(e,l);var s=function(e){o.fillText(e,t.x+y,t.y),t.y+=n+r};o.fillStyle=e.bodyFontColor,a.each(e.beforeBody,s),y=f&&"right"!==l?"center"===l?n/2+1:n+2:0,a.each(d,function(r,l){i=e.labelTextColors[l],o.fillStyle=i,a.each(r.before,s),a.each(r.lines,function(r){f&&(o.fillStyle=e.legendColorBackground,o.fillRect(g,t.y,n,n),o.lineWidth=1,o.strokeStyle=c[l].borderColor,o.strokeRect(g,t.y,n,n),o.fillStyle=c[l].backgroundColor,o.fillRect(g+1,t.y+1,n-2,n-2),o.fillStyle=i),s(r)}),a.each(r.after,s)}),y=0,a.each(e.afterBody,s),t.y-=r},drawFooter:function(t,e,o){var i=e.footer;i.length&&(t.x=h(e,e._footerAlign),t.y+=e.footerMarginTop,o.textAlign=e._footerAlign,o.textBaseline="top",o.fillStyle=e.footerFontColor,o.font=a.fontString(e.footerFontSize,e._footerFontStyle,e._footerFontFamily),a.each(i,function(i){o.fillText(i,t.x,t.y),t.y+=e.footerFontSize+e.footerSpacing}))},drawBackground:function(t,e,o,i){o.fillStyle=e.backgroundColor,o.strokeStyle=e.borderColor,o.lineWidth=e.borderWidth;var n=e.xAlign,r=e.yAlign,l=t.x,a=t.y,d=i.width,f=i.height,c=e.cornerRadius;o.beginPath(),o.moveTo(l+c,a),"top"===r&&this.drawCaret(t,i),o.lineTo(l+d-c,a),o.quadraticCurveTo(l+d,a,l+d,a+c),"center"===r&&"right"===n&&this.drawCaret(t,i),o.lineTo(l+d,a+f-c),o.quadraticCurveTo(l+d,a+f,l+d-c,a+f),"bottom"===r&&this.drawCaret(t,i),o.lineTo(l+c,a+f),o.quadraticCurveTo(l,a+f,l,a+f-c),"center"===r&&"left"===n&&this.drawCaret(t,i),o.lineTo(l,a+c),o.quadraticCurveTo(l,a,l+c,a),o.closePath(),o.fill(),e.borderWidth>0&&o.stroke()},draw:function(){var t=this._chart.ctx,e=this._view;if(0!==e.opacity){var o={width:e.width,height:e.height},i={x:e.x,y:e.y},n=Math.abs(e.opacity<.001)?0:e.opacity,r=e.title.length||e.beforeBody.length||e.body.length||e.afterBody.length||e.footer.length;this._options.enabled&&r&&(t.save(),t.globalAlpha=n,this.drawBackground(i,e,t,o),i.y+=e.yPadding,this.drawTitle(i,e,t),this.drawBody(i,e,t),this.drawFooter(i,e,t),t.restore())}},handleEvent:function(t){var e,o=this,i=o._options;return o._lastActive=o._lastActive||[],"mouseout"===t.type?o._active=[]:o._active=o._chart.getElementsAtEventForMode(t,i.mode,i),(e=!a.arrayEquals(o._active,o._lastActive))&&(o._lastActive=o._active,(i.enabled||i.custom)&&(o._eventPosition={x:t.x,y:t.y},o.update(!0),o.pivot())),e}})).positioners=f,n.exports=i,u(n.exports)?n.exports:u(i)?i:void 0});
//# sourceMappingURL=../sourcemaps/core/core.tooltip.js.map