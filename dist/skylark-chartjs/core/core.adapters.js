/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["../helpers/index"],function(e){"use strict";var exports={},module={exports:{}},t=e;function r(){throw new Error("This method is not implemented: either no adapter can be found or an incomplete integration was provided.")}function n(e){this.options=e||{}}function o(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var t;for(t in e)return!1;return!0}(e)}return t.extend(n.prototype,{formats:r,parse:r,format:r,add:r,diff:r,startOf:r,endOf:r,_create:function(e){return e}}),n.override=function(e){t.extend(n.prototype,e)},module.exports._date=n,o(module.exports)?module.exports:o(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/core/core.adapters.js.map
