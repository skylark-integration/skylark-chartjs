define([
    '../../packages/chartjs-color',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var color = __module__0;
    var helpers = __module__1;
    function interpolate(start, view, model, ease) {
        var keys = Object.keys(model);
        var i, ilen, key, actual, origin, target, type, c0, c1;
        for (i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            target = model[key];
            if (!view.hasOwnProperty(key)) {
                view[key] = target;
            }
            actual = view[key];
            if (actual === target || key[0] === '_') {
                continue;
            }
            if (!start.hasOwnProperty(key)) {
                start[key] = actual;
            }
            origin = start[key];
            type = typeof target;
            if (type === typeof origin) {
                if (type === 'string') {
                    c0 = color(origin);
                    if (c0.valid) {
                        c1 = color(target);
                        if (c1.valid) {
                            view[key] = c1.mix(c0, ease).rgbString();
                            continue;
                        }
                    }
                } else if (helpers.isFinite(origin) && helpers.isFinite(target)) {
                    view[key] = origin + (target - origin) * ease;
                    continue;
                }
            }
            view[key] = target;
        }
    }
    var Element = function (configuration) {
        helpers.extend(this, configuration);
        this.initialize.apply(this, arguments);
    };
    helpers.extend(Element.prototype, {
        initialize: function () {
            this.hidden = false;
        },
        pivot: function () {
            var me = this;
            if (!me._view) {
                me._view = helpers.clone(me._model);
            }
            me._start = {};
            return me;
        },
        transition: function (ease) {
            var me = this;
            var model = me._model;
            var start = me._start;
            var view = me._view;
            if (!model || ease === 1) {
                me._view = model;
                me._start = null;
                return me;
            }
            if (!view) {
                view = me._view = {};
            }
            if (!start) {
                start = me._start = {};
            }
            interpolate(start, view, model, ease);
            return me;
        },
        tooltipPosition: function () {
            return {
                x: this._model.x,
                y: this._model.y
            };
        },
        hasValue: function () {
            return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
        }
    });
    Element.extend = helpers.inherits;
    module.exports = Element;
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