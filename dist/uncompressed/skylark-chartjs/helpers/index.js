define([
    './helpers.core',
    './helpers.easing',
    './helpers.canvas',
    './helpers.options'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    module.exports = __module__0;
    module.exports.easing = __module__1;
    module.exports.canvas = __module__2;
    module.exports.options = __module__3;
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