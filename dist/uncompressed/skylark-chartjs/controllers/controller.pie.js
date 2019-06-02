define([
    './controller.doughnut',
    '../core/core.defaults',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DoughnutController = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    defaults._set('pie', helpers.clone(defaults.doughnut));
    defaults._set('pie', { cutoutPercentage: 0 });
    module.exports = DoughnutController;
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