define(['../helpers/helpers.core'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var defaults = {
        _set: function (scope, values) {
            return helpers.merge(this[scope] || (this[scope] = {}), values);
        }
    };
    defaults._set('global', {
        defaultColor: 'rgba(0,0,0,0.1)',
        defaultFontColor: '#666',
        defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        defaultFontSize: 12,
        defaultFontStyle: 'normal',
        defaultLineHeight: 1.2,
        showLines: true
    });
    module.exports = defaults;
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