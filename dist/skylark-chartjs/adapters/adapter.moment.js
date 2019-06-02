/**
 * skylark-chartjs - A version of chartjs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.2
 * @link https://github.com/skylarkui/skylark-chartjs/
 * @license MIT
 */
define(["../core/core.adapters"],function(e,n){"use strict";var r={},t={},f=e,u={datetime:"MMM D, YYYY, h:mm:ss a",millisecond:"h:mm:ss.SSS a",second:"h:mm:ss a",minute:"h:mm a",hour:"hA",day:"MMM D",week:"ll",month:"MMM YYYY",quarter:"[Q]Q - YYYY",year:"YYYY"};function a(e){return"object"!=typeof e||Array.isArray(e)||!function(e){var n;for(n in e)return!1;return!0}(e)}return n._date.override("function"==typeof f?{_id:"moment",formats:function(){return u},parse:function(e,n){return"string"==typeof e&&"string"==typeof n?e=f(e,n):e instanceof f||(e=f(e)),e.isValid()?e.valueOf():null},format:function(e,n){return f(e).format(n)},add:function(e,n,r){return f(e).add(n,r).valueOf()},diff:function(e,n,r){return f.duration(f(e).diff(f(n))).as(r)},startOf:function(e,n,r){return e=f(e),"isoWeek"===n?e.isoWeekday(r).valueOf():e.startOf(n).valueOf()},endOf:function(e,n){return f(e).endOf(n).valueOf()},_create:function(e){return f(e)}}:{}),a(t)?t:a(r)?r:void 0});
//# sourceMappingURL=../sourcemaps/adapters/adapter.moment.js.map
