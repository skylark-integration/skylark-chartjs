/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../colors/Color","../helpers/index"],function(t,i){"use strict";var exports={},module={exports:{}},e=t,n=i;var r=function(t){n.extend(this,t),this.initialize.apply(this,arguments)};function o(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var i;for(i in t)return!1;return!0}(t)}return n.extend(r.prototype,{initialize:function(){this.hidden=!1},pivot:function(){var t=this;return t._view||(t._view=n.clone(t._model)),t._start={},t},transition:function(t){var i=this,r=i._model,o=i._start,s=i._view;return r&&1!==t?(s||(s=i._view={}),o||(o=i._start={}),function(t,i,r,o){var s,u,a,f,l,c,h,d,p,_=Object.keys(r);for(s=0,u=_.length;s<u;++s)if(c=r[a=_[s]],i.hasOwnProperty(a)||(i[a]=c),(f=i[a])!==c&&"_"!==a[0]){if(t.hasOwnProperty(a)||(t[a]=f),(h=typeof c)==typeof(l=t[a]))if("string"===h){if((d=e(l)).valid&&(p=e(c)).valid){i[a]=p.mix(d,o).rgbString();continue}}else if(n.isFinite(l)&&n.isFinite(c)){i[a]=l+(c-l)*o;continue}i[a]=c}}(o,s,r,t),i):(i._view=r,i._start=null,i)},tooltipPosition:function(){return{x:this._model.x,y:this._model.y}},hasValue:function(){return n.isNumber(this._model.x)&&n.isNumber(this._model.y)}}),r.extend=n.inherits,module.exports=r,o(module.exports)?module.exports:o(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/core/core.element.js.map
