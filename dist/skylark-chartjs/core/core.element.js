/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../../packages/chartjs-color","../helpers/index"],function(t,i){"use strict";var e={},n={exports:{}},r=t,o=i;var s=function(t){o.extend(this,t),this.initialize.apply(this,arguments)};function a(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var i;for(i in t)return!1;return!0}(t)}return o.extend(s.prototype,{initialize:function(){this.hidden=!1},pivot:function(){var t=this;return t._view||(t._view=o.clone(t._model)),t._start={},t},transition:function(t){var i=this,e=i._model,n=i._start,s=i._view;return e&&1!==t?(s||(s=i._view={}),n||(n=i._start={}),function(t,i,e,n){var s,a,u,f,l,c,h,p,d,_=Object.keys(e);for(s=0,a=_.length;s<a;++s)if(c=e[u=_[s]],i.hasOwnProperty(u)||(i[u]=c),(f=i[u])!==c&&"_"!==u[0]){if(t.hasOwnProperty(u)||(t[u]=f),(h=typeof c)==typeof(l=t[u]))if("string"===h){if((p=r(l)).valid&&(d=r(c)).valid){i[u]=d.mix(p,n).rgbString();continue}}else if(o.isFinite(l)&&o.isFinite(c)){i[u]=l+(c-l)*n;continue}i[u]=c}}(n,s,e,t),i):(i._view=e,i._start=null,i)},tooltipPosition:function(){return{x:this._model.x,y:this._model.y}},hasValue:function(){return o.isNumber(this._model.x)&&o.isNumber(this._model.y)}}),s.extend=o.inherits,n.exports=s,a(n.exports)?n.exports:a(e)?e:void 0});
//# sourceMappingURL=../sourcemaps/core/core.element.js.map
