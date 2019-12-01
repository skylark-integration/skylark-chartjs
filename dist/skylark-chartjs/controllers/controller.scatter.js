/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["./controller.line","../core/core.defaults"],function(e,t){"use strict";var exports={},module={exports:{}},r=e;function o(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var t;for(t in e)return!1;return!0}(e)}return t._set("scatter",{hover:{mode:"single"},scales:{xAxes:[{id:"x-axis-1",type:"linear",position:"bottom"}],yAxes:[{id:"y-axis-1",type:"linear",position:"left"}]},showLines:!1,tooltips:{callbacks:{title:function(){return""},label:function(e){return"("+e.xLabel+", "+e.yLabel+")"}}}}),module.exports=r,o(module.exports)?module.exports:o(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.scatter.js.map
