define([
    './scale.category',
    './scale.linear',
    './scale.logarithmic',
    './scale.radialLinear',
    './scale.time'
], function (__module__0, __module__1, __module__2, __module__3, __module__4) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var category = __module__0;
    var linear = __module__1;
    var logarithmic = __module__2;
    var radialLinear = __module__3;
    var time = __module__4;
    module.exports = {
        category: category,
        linear: linear,
        logarithmic: logarithmic,
        radialLinear: radialLinear,
        time: time
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