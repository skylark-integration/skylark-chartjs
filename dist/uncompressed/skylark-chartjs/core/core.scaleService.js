define([
    './core.defaults',
    '../helpers/index',
    './core.layouts'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var layouts = __module__2;
    module.exports = {
        constructors: {},
        defaults: {},
        registerScaleType: function (type, scaleConstructor, scaleDefaults) {
            this.constructors[type] = scaleConstructor;
            this.defaults[type] = helpers.clone(scaleDefaults);
        },
        getScaleConstructor: function (type) {
            return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
        },
        getScaleDefaults: function (type) {
            return this.defaults.hasOwnProperty(type) ? helpers.merge({}, [
                defaults.scale,
                this.defaults[type]
            ]) : {};
        },
        updateScaleDefaults: function (type, additions) {
            var me = this;
            if (me.defaults.hasOwnProperty(type)) {
                me.defaults[type] = helpers.extend(me.defaults[type], additions);
            }
        },
        addScalesToLayout: function (chart) {
            helpers.each(chart.scales, function (scale) {
                scale.fullWidth = scale.options.fullWidth;
                scale.position = scale.options.position;
                scale.weight = scale.options.weight;
                layouts.addBox(chart, scale);
            });
        }
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