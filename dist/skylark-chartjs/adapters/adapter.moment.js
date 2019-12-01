/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylark-integration/skylark-chartjs/
 * @license MIT
 */
define(["skylark-moment","../core/core.adapters"],function(e,n){"use strict";var exports={},r={},t=e,a={datetime:"MMM D, YYYY, h:mm:ss a",millisecond:"h:mm:ss.SSS a",second:"h:mm:ss a",minute:"h:mm a",hour:"hA",day:"MMM D",week:"ll",month:"MMM YYYY",quarter:"[Q]Q - YYYY",year:"YYYY"};function f(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var n;for(n in e)return!1;return!0}(e)}return n._date.override("function"==typeof t?{_id:"moment",formats:function(){return a},parse:function(e,n){return"string"==typeof e&&"string"==typeof n?e=t(e,n):e instanceof t||(e=t(e)),e.isValid()?e.valueOf():null},format:function(e,n){return t(e).format(n)},add:function(e,n,r){return t(e).add(n,r).valueOf()},diff:function(e,n,r){return t.duration(t(e).diff(t(n))).as(r)},startOf:function(e,n,r){return e=t(e),"isoWeek"===n?e.isoWeekday(r).valueOf():e.startOf(n).valueOf()},endOf:function(e,n){return t(e).endOf(n).valueOf()},_create:function(e){return t(e)}}:{}),f(r)?r:f(exports)?exports:void 0});
//# sourceMappingURL=../sourcemaps/adapters/adapter.moment.js.map
