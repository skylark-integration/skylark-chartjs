define(['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    function abstract() {
        throw new Error('This method is not implemented: either no adapter can ' + 'be found or an incomplete integration was provided.');
    }
    function DateAdapter(options) {
        this.options = options || {};
    }
    helpers.extend(DateAdapter.prototype, {
        formats: abstract,
        parse: abstract,
        format: abstract,
        add: abstract,
        diff: abstract,
        startOf: abstract,
        endOf: abstract,
        _create: function (value) {
            return value;
        }
    });
    DateAdapter.override = function (members) {
        helpers.extend(DateAdapter.prototype, members);
    };
    module.exports._date = DateAdapter;
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