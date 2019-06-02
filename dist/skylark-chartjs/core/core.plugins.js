/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./core.defaults","../helpers/index"],function(n,i){"use strict";var t={},r={exports:{}},s=n,e=i;function o(n){return"object"!=typeof n||Array.isArray(n)||!function(n){var i;for(i in n)return!1;return!0}(n)}return s._set("global",{plugins:{}}),r.exports={_plugins:[],_cacheId:0,register:function(n){var i=this._plugins;[].concat(n).forEach(function(n){-1===i.indexOf(n)&&i.push(n)}),this._cacheId++},unregister:function(n){var i=this._plugins;[].concat(n).forEach(function(n){var t=i.indexOf(n);-1!==t&&i.splice(t,1)}),this._cacheId++},clear:function(){this._plugins=[],this._cacheId++},count:function(){return this._plugins.length},getAll:function(){return this._plugins},notify:function(n,i,t){var r,s,e,o,c,u=this.descriptors(n),p=u.length;for(r=0;r<p;++r)if("function"==typeof(c=(e=(s=u[r]).plugin)[i])&&((o=[n].concat(t||[])).push(s.options),!1===c.apply(e,o)))return!1;return!0},descriptors:function(n){var i=n.$plugins||(n.$plugins={});if(i.id===this._cacheId)return i.descriptors;var t=[],r=[],o=n&&n.config||{},c=o.options&&o.options.plugins||{};return this._plugins.concat(o.plugins||[]).forEach(function(n){if(-1===t.indexOf(n)){var i=n.id,o=c[i];!1!==o&&(!0===o&&(o=e.clone(s.global.plugins[i])),t.push(n),r.push({plugin:n,options:o||{}}))}}),i.descriptors=r,i.id=this._cacheId,r},_invalidate:function(n){delete n.$plugins}},o(r.exports)?r.exports:o(t)?t:void 0});
//# sourceMappingURL=../sourcemaps/core/core.plugins.js.map
