define([
    '../helpers/index',
    './scale.linearbase',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var LinearScaleBase = __module__1;
    var Ticks = __module__2;
    var defaultConfig = {
        position: 'left',
        ticks: { callback: Ticks.formatters.linear }
    };
    module.exports = LinearScaleBase.extend({
        determineDataLimits: function () {
            var me = this;
            var opts = me.options;
            var chart = me.chart;
            var data = chart.data;
            var datasets = data.datasets;
            var isHorizontal = me.isHorizontal();
            var DEFAULT_MIN = 0;
            var DEFAULT_MAX = 1;
            function IDMatches(meta) {
                return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
            }
            me.min = null;
            me.max = null;
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
                    if (valuesPerStack[key] === undefined) {
                        valuesPerStack[key] = {
                            positiveValues: [],
                            negativeValues: []
                        };
                    }
                    var positiveValues = valuesPerStack[key].positiveValues;
                    var negativeValues = valuesPerStack[key].negativeValues;
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden) {
                                return;
                            }
                            positiveValues[index] = positiveValues[index] || 0;
                            negativeValues[index] = negativeValues[index] || 0;
                            if (opts.relativePoints) {
                                positiveValues[index] = 100;
                            } else if (value < 0) {
                                negativeValues[index] += value;
                            } else {
                                positiveValues[index] += value;
                            }
                        });
                    }
                });
                helpers.each(valuesPerStack, function (valuesForType) {
                    var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
                    var minVal = helpers.min(values);
                    var maxVal = helpers.max(values);
                    me.min = me.min === null ? minVal : Math.min(me.min, minVal);
                    me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
                });
            } else {
                helpers.each(datasets, function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
                        helpers.each(dataset.data, function (rawValue, index) {
                            var value = +me.getRightValue(rawValue);
                            if (isNaN(value) || meta.data[index].hidden) {
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
                        });
                    }
                });
            }
            me.min = isFinite(me.min) && !isNaN(me.min) ? me.min : DEFAULT_MIN;
            me.max = isFinite(me.max) && !isNaN(me.max) ? me.max : DEFAULT_MAX;
            this.handleTickRangeOptions();
        },
        _computeTickLimit: function () {
            var me = this;
            var tickFont;
            if (me.isHorizontal()) {
                return Math.ceil(me.width / 40);
            }
            tickFont = helpers.options._parseFont(me.options.ticks);
            return Math.ceil(me.height / tickFont.lineHeight);
        },
        handleDirectionalChanges: function () {
            if (!this.isHorizontal()) {
                this.ticks.reverse();
            }
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        getPixelForValue: function (value) {
            var me = this;
            var start = me.start;
            var rightValue = +me.getRightValue(value);
            var pixel;
            var range = me.end - start;
            if (me.isHorizontal()) {
                pixel = me.left + me.width / range * (rightValue - start);
            } else {
                pixel = me.bottom - me.height / range * (rightValue - start);
            }
            return pixel;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var innerDimension = isHorizontal ? me.width : me.height;
            var offset = (isHorizontal ? pixel - me.left : me.bottom - pixel) / innerDimension;
            return me.start + (me.end - me.start) * offset;
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.ticksAsNumbers[index]);
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