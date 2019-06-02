define([
    '../core/core.defaults',
    '../helpers/index',
    '../core/core.scale',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var Scale = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    function generateTicks(generationOptions, dataRange) {
        var ticks = [];
        var tickVal = valueOrDefault(generationOptions.min, Math.pow(10, Math.floor(helpers.log10(dataRange.min))));
        var endExp = Math.floor(helpers.log10(dataRange.max));
        var endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
        var exp, significand;
        if (tickVal === 0) {
            exp = Math.floor(helpers.log10(dataRange.minNotZero));
            significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));
            ticks.push(tickVal);
            tickVal = significand * Math.pow(10, exp);
        } else {
            exp = Math.floor(helpers.log10(tickVal));
            significand = Math.floor(tickVal / Math.pow(10, exp));
        }
        var precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
        do {
            ticks.push(tickVal);
            ++significand;
            if (significand === 10) {
                significand = 1;
                ++exp;
                precision = exp >= 0 ? 1 : precision;
            }
            tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
        } while (exp < endExp || exp === endExp && significand < endSignificand);
        var lastTick = valueOrDefault(generationOptions.max, tickVal);
        ticks.push(lastTick);
        return ticks;
    }
    var defaultConfig = {
        position: 'left',
        ticks: { callback: Ticks.formatters.logarithmic }
    };
    function nonNegativeOrDefault(value, defaultValue) {
        return helpers.isFinite(value) && value >= 0 ? value : defaultValue;
    }
    module.exports = Scale.extend({
        determineDataLimits: function () {
            var me = this;
            var opts = me.options;
            var chart = me.chart;
            var data = chart.data;
            var datasets = data.datasets;
            var isHorizontal = me.isHorizontal();
            function IDMatches(meta) {
                return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
            }
            me.min = null;
            me.max = null;
            me.minNotZero = null;
            var hasStacks = opts.stacked;
            if (hasStacks === undefined) {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    if (hasStacks) {
                        return;
                    }
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) && meta.stack !== undefined) {
                        hasStacks = true;
                    }
                });
            }
            if (opts.stacked || hasStacks) {
                var valuesPerStack = {};
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    var key = [
                        meta.type,
                        opts.stacked === undefined && meta.stack === undefined ? datasetIndex : '',
                        meta.stack
                    ].join('.');
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        if (valuesPerStack[key] === undefined) {
                            valuesPerStack[key] = [];
                        }
                        helpers.each(dataset.data, function (rawValue, index) {
                            var values = valuesPerStack[key];
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden || value < 0) {
                                return;
                            }
                            values[index] = values[index] || 0;
                            values[index] += value;
                        });
                    }
                });
                helpers.each(valuesPerStack, function (valuesForType) {
                    if (valuesForType.length > 0) {
                        var minVal = helpers.min(valuesForType);
                        var maxVal = helpers.max(valuesForType);
                        me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                        me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
                    }
                });
            } else {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden || value < 0) {
                                return;
                            }
                            if (me.min === null) {
                                me.min = value;
                            } else if (value < me.min) {
                                me.min = value;
                            }
                            if (me.max === null) {
                                me.max = value;
                            } else if (value > me.max) {
                                me.max = value;
                            }
                            if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
                                me.minNotZero = value;
                            }
                        });
                    }
                });
            }
            this.handleTickRangeOptions();
        },
        handleTickRangeOptions: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var DEFAULT_MIN = 1;
            var DEFAULT_MAX = 10;
            me.min = nonNegativeOrDefault(tickOpts.min, me.min);
            me.max = nonNegativeOrDefault(tickOpts.max, me.max);
            if (me.min === me.max) {
                if (me.min !== 0 && me.min !== null) {
                    me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
                    me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
                } else {
                    me.min = DEFAULT_MIN;
                    me.max = DEFAULT_MAX;
                }
            }
            if (me.min === null) {
                me.min = Math.pow(10, Math.floor(helpers.log10(me.max)) - 1);
            }
            if (me.max === null) {
                me.max = me.min !== 0 ? Math.pow(10, Math.floor(helpers.log10(me.min)) + 1) : DEFAULT_MAX;
            }
            if (me.minNotZero === null) {
                if (me.min > 0) {
                    me.minNotZero = me.min;
                } else if (me.max < 1) {
                    me.minNotZero = Math.pow(10, Math.floor(helpers.log10(me.max)));
                } else {
                    me.minNotZero = DEFAULT_MIN;
                }
            }
        },
        buildTicks: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = !me.isHorizontal();
            var generationOptions = {
                min: nonNegativeOrDefault(tickOpts.min),
                max: nonNegativeOrDefault(tickOpts.max)
            };
            var ticks = me.ticks = generateTicks(generationOptions, me);
            me.max = helpers.max(ticks);
            me.min = helpers.min(ticks);
            if (tickOpts.reverse) {
                reverse = !reverse;
                me.start = me.max;
                me.end = me.min;
            } else {
                me.start = me.min;
                me.end = me.max;
            }
            if (reverse) {
                ticks.reverse();
            }
        },
        convertTicksToLabels: function () {
            this.tickValues = this.ticks.slice();
            Scale.prototype.convertTicksToLabels.call(this);
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.tickValues[index]);
        },
        _getFirstTickValue: function (value) {
            var exp = Math.floor(helpers.log10(value));
            var significand = Math.floor(value / Math.pow(10, exp));
            return significand * Math.pow(10, exp);
        },
        getPixelForValue: function (value) {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = tickOpts.reverse;
            var log10 = helpers.log10;
            var firstTickValue = me._getFirstTickValue(me.minNotZero);
            var offset = 0;
            var innerDimension, pixel, start, end, sign;
            value = +me.getRightValue(value);
            if (reverse) {
                start = me.end;
                end = me.start;
                sign = -1;
            } else {
                start = me.start;
                end = me.end;
                sign = 1;
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                pixel = reverse ? me.right : me.left;
            } else {
                innerDimension = me.height;
                sign *= -1;
                pixel = reverse ? me.top : me.bottom;
            }
            if (value !== start) {
                if (start === 0) {
                    offset = valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize);
                    innerDimension -= offset;
                    start = firstTickValue;
                }
                if (value !== 0) {
                    offset += innerDimension / (log10(end) - log10(start)) * (log10(value) - log10(start));
                }
                pixel += sign * offset;
            }
            return pixel;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var tickOpts = me.options.ticks;
            var reverse = tickOpts.reverse;
            var log10 = helpers.log10;
            var firstTickValue = me._getFirstTickValue(me.minNotZero);
            var innerDimension, start, end, value;
            if (reverse) {
                start = me.end;
                end = me.start;
            } else {
                start = me.start;
                end = me.end;
            }
            if (me.isHorizontal()) {
                innerDimension = me.width;
                value = reverse ? me.right - pixel : pixel - me.left;
            } else {
                innerDimension = me.height;
                value = reverse ? pixel - me.top : me.bottom - pixel;
            }
            if (value !== start) {
                if (start === 0) {
                    var offset = valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize);
                    value -= offset;
                    innerDimension -= offset;
                    start = firstTickValue;
                }
                value *= log10(end) - log10(start);
                value /= innerDimension;
                value = Math.pow(10, log10(start) + value);
            }
            return value;
        }
    });
    module.exports._defaults = defaultConfig;
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