define([
    '../helpers/index',
    '../core/core.scale'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var Scale = __module__1;
    var noop = helpers.noop;
    var isNullOrUndef = helpers.isNullOrUndef;
    function generateTicks(generationOptions, dataRange) {
        var ticks = [];
        var MIN_SPACING = 1e-14;
        var stepSize = generationOptions.stepSize;
        var unit = stepSize || 1;
        var maxNumSpaces = generationOptions.maxTicks - 1;
        var min = generationOptions.min;
        var max = generationOptions.max;
        var precision = generationOptions.precision;
        var rmin = dataRange.min;
        var rmax = dataRange.max;
        var spacing = helpers.niceNum((rmax - rmin) / maxNumSpaces / unit) * unit;
        var factor, niceMin, niceMax, numSpaces;
        if (spacing < MIN_SPACING && isNullOrUndef(min) && isNullOrUndef(max)) {
            return [
                rmin,
                rmax
            ];
        }
        numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
        if (numSpaces > maxNumSpaces) {
            spacing = helpers.niceNum(numSpaces * spacing / maxNumSpaces / unit) * unit;
        }
        if (stepSize || isNullOrUndef(precision)) {
            factor = Math.pow(10, helpers._decimalPlaces(spacing));
        } else {
            factor = Math.pow(10, precision);
            spacing = Math.ceil(spacing * factor) / factor;
        }
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
        if (stepSize) {
            if (!isNullOrUndef(min) && helpers.almostWhole(min / spacing, spacing / 1000)) {
                niceMin = min;
            }
            if (!isNullOrUndef(max) && helpers.almostWhole(max / spacing, spacing / 1000)) {
                niceMax = max;
            }
        }
        numSpaces = (niceMax - niceMin) / spacing;
        if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
            numSpaces = Math.round(numSpaces);
        } else {
            numSpaces = Math.ceil(numSpaces);
        }
        niceMin = Math.round(niceMin * factor) / factor;
        niceMax = Math.round(niceMax * factor) / factor;
        ticks.push(isNullOrUndef(min) ? niceMin : min);
        for (var j = 1; j < numSpaces; ++j) {
            ticks.push(Math.round((niceMin + j * spacing) * factor) / factor);
        }
        ticks.push(isNullOrUndef(max) ? niceMax : max);
        return ticks;
    }
    module.exports = Scale.extend({
        getRightValue: function (value) {
            if (typeof value === 'string') {
                return +value;
            }
            return Scale.prototype.getRightValue.call(this, value);
        },
        handleTickRangeOptions: function () {
            var me = this;
            var opts = me.options;
            var tickOpts = opts.ticks;
            if (tickOpts.beginAtZero) {
                var minSign = helpers.sign(me.min);
                var maxSign = helpers.sign(me.max);
                if (minSign < 0 && maxSign < 0) {
                    me.max = 0;
                } else if (minSign > 0 && maxSign > 0) {
                    me.min = 0;
                }
            }
            var setMin = tickOpts.min !== undefined || tickOpts.suggestedMin !== undefined;
            var setMax = tickOpts.max !== undefined || tickOpts.suggestedMax !== undefined;
            if (tickOpts.min !== undefined) {
                me.min = tickOpts.min;
            } else if (tickOpts.suggestedMin !== undefined) {
                if (me.min === null) {
                    me.min = tickOpts.suggestedMin;
                } else {
                    me.min = Math.min(me.min, tickOpts.suggestedMin);
                }
            }
            if (tickOpts.max !== undefined) {
                me.max = tickOpts.max;
            } else if (tickOpts.suggestedMax !== undefined) {
                if (me.max === null) {
                    me.max = tickOpts.suggestedMax;
                } else {
                    me.max = Math.max(me.max, tickOpts.suggestedMax);
                }
            }
            if (setMin !== setMax) {
                if (me.min >= me.max) {
                    if (setMin) {
                        me.max = me.min + 1;
                    } else {
                        me.min = me.max - 1;
                    }
                }
            }
            if (me.min === me.max) {
                me.max++;
                if (!tickOpts.beginAtZero) {
                    me.min--;
                }
            }
        },
        getTickLimit: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var stepSize = tickOpts.stepSize;
            var maxTicksLimit = tickOpts.maxTicksLimit;
            var maxTicks;
            if (stepSize) {
                maxTicks = Math.ceil(me.max / stepSize) - Math.floor(me.min / stepSize) + 1;
            } else {
                maxTicks = me._computeTickLimit();
                maxTicksLimit = maxTicksLimit || 11;
            }
            if (maxTicksLimit) {
                maxTicks = Math.min(maxTicksLimit, maxTicks);
            }
            return maxTicks;
        },
        _computeTickLimit: function () {
            return Number.POSITIVE_INFINITY;
        },
        handleDirectionalChanges: noop,
        buildTicks: function () {
            var me = this;
            var opts = me.options;
            var tickOpts = opts.ticks;
            var maxTicks = me.getTickLimit();
            maxTicks = Math.max(2, maxTicks);
            var numericGeneratorOptions = {
                maxTicks: maxTicks,
                min: tickOpts.min,
                max: tickOpts.max,
                precision: tickOpts.precision,
                stepSize: helpers.valueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize)
            };
            var ticks = me.ticks = generateTicks(numericGeneratorOptions, me);
            me.handleDirectionalChanges();
            me.max = helpers.max(ticks);
            me.min = helpers.min(ticks);
            if (tickOpts.reverse) {
                ticks.reverse();
                me.start = me.max;
                me.end = me.min;
            } else {
                me.start = me.min;
                me.end = me.max;
            }
        },
        convertTicksToLabels: function () {
            var me = this;
            me.ticksAsNumbers = me.ticks.slice();
            me.zeroLineIndex = me.ticks.indexOf(0);
            Scale.prototype.convertTicksToLabels.call(me);
        }
    });
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