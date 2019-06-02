define(['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    module.exports = {
        formatters: {
            values: function (value) {
                return helpers.isArray(value) ? value : '' + value;
            },
            linear: function (tickValue, index, ticks) {
                var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];
                if (Math.abs(delta) > 1) {
                    if (tickValue !== Math.floor(tickValue)) {
                        delta = tickValue - Math.floor(tickValue);
                    }
                }
                var logDelta = helpers.log10(Math.abs(delta));
                var tickString = '';
                if (tickValue !== 0) {
                    var maxTick = Math.max(Math.abs(ticks[0]), Math.abs(ticks[ticks.length - 1]));
                    if (maxTick < 0.0001) {
                        var logTick = helpers.log10(Math.abs(tickValue));
                        tickString = tickValue.toExponential(Math.floor(logTick) - Math.floor(logDelta));
                    } else {
                        var numDecimal = -1 * Math.floor(logDelta);
                        numDecimal = Math.max(Math.min(numDecimal, 20), 0);
                        tickString = tickValue.toFixed(numDecimal);
                    }
                } else {
                    tickString = '0';
                }
                return tickString;
            },
            logarithmic: function (tickValue, index, ticks) {
                var remain = tickValue / Math.pow(10, Math.floor(helpers.log10(tickValue)));
                if (tickValue === 0) {
                    return '0';
                } else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
                    return tickValue.toExponential();
                }
                return '';
            }
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