/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["./controller.line","../core/core.defaults"],function(e,t){"use strict";var r={},o={exports:{}},n=e;function i(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var t;for(t in e)return!1;return!0}(e)}return t._set("scatter",{hover:{mode:"single"},scales:{xAxes:[{id:"x-axis-1",type:"linear",position:"bottom"}],yAxes:[{id:"y-axis-1",type:"linear",position:"left"}]},showLines:!1,tooltips:{callbacks:{title:function(){return""},label:function(e){return"("+e.xLabel+", "+e.yLabel+")"}}}}),o.exports=n,i(o.exports)?o.exports:i(r)?r:void 0});
//# sourceMappingURL=../sourcemaps/controllers/controller.scatter.js.map
