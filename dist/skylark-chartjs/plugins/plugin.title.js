/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.defaults","../core/core.element","../helpers/index","../core/core.layouts"],function(t,e,i,o){"use strict";var n={},r={exports:{}},a=t,l=e,s=i,d=o,f=s.noop;a._set("global",{title:{display:!1,fontStyle:"bold",fullWidth:!0,padding:10,position:"top",text:"",weight:2e3}});var h=l.extend({initialize:function(t){s.extend(this,t),this.legendHitBoxes=[]},beforeUpdate:f,update:function(t,e,i){var o=this;return o.beforeUpdate(),o.maxWidth=t,o.maxHeight=e,o.margins=i,o.beforeSetDimensions(),o.setDimensions(),o.afterSetDimensions(),o.beforeBuildLabels(),o.buildLabels(),o.afterBuildLabels(),o.beforeFit(),o.fit(),o.afterFit(),o.afterUpdate(),o.minSize},afterUpdate:f,beforeSetDimensions:f,setDimensions:function(){var t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=0,t.right=t.width):(t.height=t.maxHeight,t.top=0,t.bottom=t.height),t.paddingLeft=0,t.paddingTop=0,t.paddingRight=0,t.paddingBottom=0,t.minSize={width:0,height:0}},afterSetDimensions:f,beforeBuildLabels:f,buildLabels:f,afterBuildLabels:f,beforeFit:f,fit:function(){var t=this,e=t.options,i=e.display,o=t.minSize,n=s.isArray(e.text)?e.text.length:1,r=s.options._parseFont(e),a=i?n*r.lineHeight+2*e.padding:0;t.isHorizontal()?(o.width=t.maxWidth,o.height=a):(o.width=a,o.height=t.maxHeight),t.width=o.width,t.height=o.height},afterFit:f,isHorizontal:function(){var t=this.options.position;return"top"===t||"bottom"===t},draw:function(){var t=this,e=t.ctx,i=t.options;if(i.display){var o,n,r,l=s.options._parseFont(i),d=l.lineHeight,f=d/2+i.padding,h=0,p=t.top,g=t.left,u=t.bottom,c=t.right;e.fillStyle=s.valueOrDefault(i.fontColor,a.global.defaultFontColor),e.font=l.string,t.isHorizontal()?(n=g+(c-g)/2,r=p+f,o=c-g):(n="left"===i.position?g+f:c-f,r=p+(u-p)/2,o=u-p,h=Math.PI*("left"===i.position?-.5:.5)),e.save(),e.translate(n,r),e.rotate(h),e.textAlign="center",e.textBaseline="middle";var x=i.text;if(s.isArray(x))for(var b=0,m=0;m<x.length;++m)e.fillText(x[m],0,b,o),b+=d;else e.fillText(x,0,0,o);e.restore()}}});function p(t,e){var i=new h({ctx:t.ctx,options:e,chart:t});d.configure(t,i,e),d.addBox(t,i),t.titleBlock=i}function g(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return r.exports={id:"title",_element:h,beforeInit:function(t){var e=t.options.title;e&&p(t,e)},beforeUpdate:function(t){var e=t.options.title,i=t.titleBlock;e?(s.mergeIf(e,a.global.title),i?(d.configure(t,i,e),i.options=e):p(t,e)):i&&(d.removeBox(t,i),delete t.titleBlock)}},g(r.exports)?r.exports:g(n)?n:void 0});
//# sourceMappingURL=../sourcemaps/plugins/plugin.title.js.map