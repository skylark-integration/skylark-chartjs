/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./controller.bar","../core/core.defaults"],function(e,t){"use strict";var exports={},module={exports:{}},r=e;function o(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var t;for(t in e)return!1;return!0}(e)}return t._set("horizontalBar",{hover:{mode:"index",axis:"y"},scales:{xAxes:[{type:"linear",position:"bottom"}],yAxes:[{type:"category",position:"left",categoryPercentage:.8,barPercentage:.9,offset:!0,gridLines:{offsetGridLines:!0}}]},elements:{rectangle:{borderSkipped:"left"}},tooltips:{mode:"index",axis:"y"}}),module.exports=r.extend({_getValueScaleId:function(){return this.getMeta().xAxisID},_getIndexScaleId:function(){return this.getMeta().yAxisID}}),o(module.exports)?module.exports:o(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.horizontalBar.js.map
