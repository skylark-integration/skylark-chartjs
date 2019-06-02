/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index"],function(e){"use strict";var t={},r={exports:{}},n=e;function o(){throw new Error("This method is not implemented: either no adapter can be found or an incomplete integration was provided.")}function i(e){this.options=e||{}}function a(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var t;for(t in e)return!1;return!0}(e)}return n.extend(i.prototype,{formats:o,parse:o,format:o,add:o,diff:o,startOf:o,endOf:o,_create:function(e){return e}}),i.override=function(e){n.extend(i.prototype,e)},r.exports._date=i,a(r.exports)?r.exports:a(t)?t:void 0});
//# sourceMappingURL=../sourcemaps/core/core.adapters.js.map
