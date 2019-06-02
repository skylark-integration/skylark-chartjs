/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index"],function(t){"use strict";var e={},a={exports:{}},n=t,r=n.options.resolve,i=["push","pop","shift","splice","unshift"];function s(t,e){var a=t._chartjs;if(a){var n=a.listeners,r=n.indexOf(e);-1!==r&&n.splice(r,1),n.length>0||(i.forEach(function(e){delete t[e]}),delete t._chartjs)}}var o=function(t,e){this.initialize(t,e)};function d(t){return"object"!=typeof t||Array.isArray(t)||!function(t){var e;for(e in t)return!1;return!0}(t)}return n.extend(o.prototype,{datasetElementType:null,dataElementType:null,initialize:function(t,e){this.chart=t,this.index=e,this.linkScales(),this.addElements()},updateIndex:function(t){this.index=t},linkScales:function(){var t=this,e=t.getMeta(),a=t.getDataset();null!==e.xAxisID&&e.xAxisID in t.chart.scales||(e.xAxisID=a.xAxisID||t.chart.options.scales.xAxes[0].id),null!==e.yAxisID&&e.yAxisID in t.chart.scales||(e.yAxisID=a.yAxisID||t.chart.options.scales.yAxes[0].id)},getDataset:function(){return this.chart.data.datasets[this.index]},getMeta:function(){return this.chart.getDatasetMeta(this.index)},getScaleForId:function(t){return this.chart.scales[t]},_getValueScaleId:function(){return this.getMeta().yAxisID},_getIndexScaleId:function(){return this.getMeta().xAxisID},_getValueScale:function(){return this.getScaleForId(this._getValueScaleId())},_getIndexScale:function(){return this.getScaleForId(this._getIndexScaleId())},reset:function(){this.update(!0)},destroy:function(){this._data&&s(this._data,this)},createMetaDataset:function(){var t=this.datasetElementType;return t&&new t({_chart:this.chart,_datasetIndex:this.index})},createMetaData:function(t){var e=this.dataElementType;return e&&new e({_chart:this.chart,_datasetIndex:this.index,_index:t})},addElements:function(){var t,e,a=this.getMeta(),n=this.getDataset().data||[],r=a.data;for(t=0,e=n.length;t<e;++t)r[t]=r[t]||this.createMetaData(t);a.dataset=a.dataset||this.createMetaDataset()},addElementAndReset:function(t){var e=this.createMetaData(t);this.getMeta().data.splice(t,0,e),this.updateElement(e,t,!0)},buildOrUpdateElements:function(){var t,e,a=this,r=a.getDataset(),o=r.data||(r.data=[]);a._data!==o&&(a._data&&s(a._data,a),o&&Object.isExtensible(o)&&(e=a,(t=o)._chartjs?t._chartjs.listeners.push(e):(Object.defineProperty(t,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[e]}}),i.forEach(function(e){var a="onData"+e.charAt(0).toUpperCase()+e.slice(1),r=t[e];Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:function(){var e=Array.prototype.slice.call(arguments),i=r.apply(this,e);return n.each(t._chartjs.listeners,function(t){"function"==typeof t[a]&&t[a].apply(t,e)}),i}})}))),a._data=o),a.resyncElements()},update:n.noop,transition:function(t){for(var e=this.getMeta(),a=e.data||[],n=a.length,r=0;r<n;++r)a[r].transition(t);e.dataset&&e.dataset.transition(t)},draw:function(){var t=this.getMeta(),e=t.data||[],a=e.length,n=0;for(t.dataset&&t.dataset.draw();n<a;++n)e[n].draw()},removeHoverStyle:function(t){n.merge(t._model,t.$previousStyle||{}),delete t.$previousStyle},setHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],a=t._index,i=t.custom||{},s=t._model,o=n.getHoverColor;t.$previousStyle={backgroundColor:s.backgroundColor,borderColor:s.borderColor,borderWidth:s.borderWidth},s.backgroundColor=r([i.hoverBackgroundColor,e.hoverBackgroundColor,o(s.backgroundColor)],void 0,a),s.borderColor=r([i.hoverBorderColor,e.hoverBorderColor,o(s.borderColor)],void 0,a),s.borderWidth=r([i.hoverBorderWidth,e.hoverBorderWidth,s.borderWidth],void 0,a)},resyncElements:function(){var t=this.getMeta(),e=this.getDataset().data,a=t.data.length,n=e.length;n<a?t.data.splice(n,a-n):n>a&&this.insertElements(a,n-a)},insertElements:function(t,e){for(var a=0;a<e;++a)this.addElementAndReset(t+a)},onDataPush:function(){var t=arguments.length;this.insertElements(this.getDataset().data.length-t,t)},onDataPop:function(){this.getMeta().data.pop()},onDataShift:function(){this.getMeta().data.shift()},onDataSplice:function(t,e){this.getMeta().data.splice(t,e),this.insertElements(t,arguments.length-2)},onDataUnshift:function(){this.insertElements(0,arguments.length)}}),o.extend=n.inherits,a.exports=o,d(a.exports)?a.exports:d(e)?e:void 0});
//# sourceMappingURL=../sourcemaps/core/core.datasetController.js.map
