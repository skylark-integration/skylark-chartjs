define([
    '../helpers/index',
    './platform.basic',
    './platform.dom'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var basic = __module__1;
    var dom = __module__2;
    var implementation = dom._enabled ? dom : basic;
    module.exports = helpers.extend({
        initialize: function () {
        },
        acquireContext: function () {
        },
        releaseContext: function () {
        },
        addEventListener: function () {
        },
        removeEventListener: function () {
        }
    }, implementation);
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