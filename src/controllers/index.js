define([
    './controller.bar',
    './controller.bubble',
    './controller.doughnut',
    './controller.horizontalBar',
    './controller.line',
    './controller.polarArea',
    './controller.pie',
    './controller.radar',
    './controller.scatter'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var bar = __module__0;
    var bubble = __module__1;
    var doughnut = __module__2;
    var horizontalBar = __module__3;
    var line = __module__4;
    var polarArea = __module__5;
    var pie = __module__6;
    var radar = __module__7;
    var scatter = __module__8;
    module.exports = {
        bar: bar,
        bubble: bubble,
        doughnut: doughnut,
        horizontalBar: horizontalBar,
        line: line,
        polarArea: polarArea,
        pie: pie,
        radar: radar,
        scatter: scatter
    };
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});