define([
    '../core/core.datasetController',
    '../core/core.defaults',
    '../elements/index',
    '../helpers/index'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var DatasetController = __module__0;
    var defaults = __module__1;
    var elements = __module__2;
    var helpers = __module__3;
    var resolve = helpers.options.resolve;
    defaults._set('bar', {
        hover: { mode: 'label' },
        scales: {
            xAxes: [{
                    type: 'category',
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                    offset: true,
                    gridLines: { offsetGridLines: true }
                }],
            yAxes: [{ type: 'linear' }]
        }
    });
    function computeMinSampleSize(scale, pixels) {
        var min = scale.isHorizontal() ? scale.width : scale.height;
        var ticks = scale.getTicks();
        var prev, curr, i, ilen;
        for (i = 1, ilen = pixels.length; i < ilen; ++i) {
            min = Math.min(min, Math.abs(pixels[i] - pixels[i - 1]));
        }
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            curr = scale.getPixelForTick(i);
            min = i > 0 ? Math.min(min, curr - prev) : min;
            prev = curr;
        }
        return min;
    }
    function computeFitCategoryTraits(index, ruler, options) {
        var thickness = options.barThickness;
        var count = ruler.stackCount;
        var curr = ruler.pixels[index];
        var size, ratio;
        if (helpers.isNullOrUndef(thickness)) {
            size = ruler.min * options.categoryPercentage;
            ratio = options.barPercentage;
        } else {
            size = thickness * count;
            ratio = 1;
        }
        return {
            chunk: size / count,
            ratio: ratio,
            start: curr - size / 2
        };
    }
    function computeFlexCategoryTraits(index, ruler, options) {
        var pixels = ruler.pixels;
        var curr = pixels[index];
        var prev = index > 0 ? pixels[index - 1] : null;
        var next = index < pixels.length - 1 ? pixels[index + 1] : null;
        var percent = options.categoryPercentage;
        var start, size;
        if (prev === null) {
            prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
        }
        if (next === null) {
            next = curr + curr - prev;
        }
        start = curr - (curr - Math.min(prev, next)) / 2 * percent;
        size = Math.abs(next - prev) / 2 * percent;
        return {
            chunk: size / ruler.stackCount,
            ratio: options.barPercentage,
            start: start
        };
    }
    module.exports = DatasetController.extend({
        dataElementType: elements.Rectangle,
        initialize: function () {
            var me = this;
            var meta;
            DatasetController.prototype.initialize.apply(me, arguments);
            meta = me.getMeta();
            meta.stack = me.getDataset().stack;
            meta.bar = true;
        },
        update: function (reset) {
            var me = this;
            var rects = me.getMeta().data;
            var i, ilen;
            me._ruler = me.getRuler();
            for (i = 0, ilen = rects.length; i < ilen; ++i) {
                me.updateElement(rects[i], i, reset);
            }
        },
        updateElement: function (rectangle, index, reset) {
            var me = this;
            var meta = me.getMeta();
            var dataset = me.getDataset();
            var options = me._resolveElementOptions(rectangle, index);
            rectangle._xScale = me.getScaleForId(meta.xAxisID);
            rectangle._yScale = me.getScaleForId(meta.yAxisID);
            rectangle._datasetIndex = me.index;
            rectangle._index = index;
            rectangle._model = {
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderSkipped: options.borderSkipped,
                borderWidth: options.borderWidth,
                datasetLabel: dataset.label,
                label: me.chart.data.labels[index]
            };
            me._updateElementGeometry(rectangle, index, reset);
            rectangle.pivot();
        },
        _updateElementGeometry: function (rectangle, index, reset) {
            var me = this;
            var model = rectangle._model;
            var vscale = me._getValueScale();
            var base = vscale.getBasePixel();
            var horizontal = vscale.isHorizontal();
            var ruler = me._ruler || me.getRuler();
            var vpixels = me.calculateBarValuePixels(me.index, index);
            var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
            model.horizontal = horizontal;
            model.base = reset ? base : vpixels.base;
            model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
            model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
            model.height = horizontal ? ipixels.size : undefined;
            model.width = horizontal ? undefined : ipixels.size;
        },
        _getStacks: function (last) {
            var me = this;
            var chart = me.chart;
            var scale = me._getIndexScale();
            var stacked = scale.options.stacked;
            var ilen = last === undefined ? chart.data.datasets.length : last + 1;
            var stacks = [];
            var i, meta;
            for (i = 0; i < ilen; ++i) {
                meta = chart.getDatasetMeta(i);
                if (meta.bar && chart.isDatasetVisible(i) && (stacked === false || stacked === true && stacks.indexOf(meta.stack) === -1 || stacked === undefined && (meta.stack === undefined || stacks.indexOf(meta.stack) === -1))) {
                    stacks.push(meta.stack);
                }
            }
            return stacks;
        },
        getStackCount: function () {
            return this._getStacks().length;
        },
        getStackIndex: function (datasetIndex, name) {
            var stacks = this._getStacks(datasetIndex);
            var index = name !== undefined ? stacks.indexOf(name) : -1;
            return index === -1 ? stacks.length - 1 : index;
        },
        getRuler: function () {
            var me = this;
            var scale = me._getIndexScale();
            var stackCount = me.getStackCount();
            var datasetIndex = me.index;
            var isHorizontal = scale.isHorizontal();
            var start = isHorizontal ? scale.left : scale.top;
            var end = start + (isHorizontal ? scale.width : scale.height);
            var pixels = [];
            var i, ilen, min;
            for (i = 0, ilen = me.getMeta().data.length; i < ilen; ++i) {
                pixels.push(scale.getPixelForValue(null, i, datasetIndex));
            }
            min = helpers.isNullOrUndef(scale.options.barThickness) ? computeMinSampleSize(scale, pixels) : -1;
            return {
                min: min,
                pixels: pixels,
                start: start,
                end: end,
                stackCount: stackCount,
                scale: scale
            };
        },
        calculateBarValuePixels: function (datasetIndex, index) {
            var me = this;
            var chart = me.chart;
            var meta = me.getMeta();
            var scale = me._getValueScale();
            var isHorizontal = scale.isHorizontal();
            var datasets = chart.data.datasets;
            var value = +scale.getRightValue(datasets[datasetIndex].data[index]);
            var minBarLength = scale.options.minBarLength;
            var stacked = scale.options.stacked;
            var stack = meta.stack;
            var start = 0;
            var i, imeta, ivalue, base, head, size;
            if (stacked || stacked === undefined && stack !== undefined) {
                for (i = 0; i < datasetIndex; ++i) {
                    imeta = chart.getDatasetMeta(i);
                    if (imeta.bar && imeta.stack === stack && imeta.controller._getValueScaleId() === scale.id && chart.isDatasetVisible(i)) {
                        ivalue = +scale.getRightValue(datasets[i].data[index]);
                        if (value < 0 && ivalue < 0 || value >= 0 && ivalue > 0) {
                            start += ivalue;
                        }
                    }
                }
            }
            base = scale.getPixelForValue(start);
            head = scale.getPixelForValue(start + value);
            size = head - base;
            if (minBarLength !== undefined && Math.abs(size) < minBarLength) {
                size = minBarLength;
                if (value >= 0 && !isHorizontal || value < 0 && isHorizontal) {
                    head = base - minBarLength;
                } else {
                    head = base + minBarLength;
                }
            }
            return {
                size: size,
                base: base,
                head: head,
                center: head + size / 2
            };
        },
        calculateBarIndexPixels: function (datasetIndex, index, ruler) {
            var me = this;
            var options = ruler.scale.options;
            var range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options) : computeFitCategoryTraits(index, ruler, options);
            var stackIndex = me.getStackIndex(datasetIndex, me.getMeta().stack);
            var center = range.start + range.chunk * stackIndex + range.chunk / 2;
            var size = Math.min(helpers.valueOrDefault(options.maxBarThickness, Infinity), range.chunk * range.ratio);
            return {
                base: center - size / 2,
                head: center + size / 2,
                center: center,
                size: size
            };
        },
        draw: function () {
            var me = this;
            var chart = me.chart;
            var scale = me._getValueScale();
            var rects = me.getMeta().data;
            var dataset = me.getDataset();
            var ilen = rects.length;
            var i = 0;
            helpers.canvas.clipArea(chart.ctx, chart.chartArea);
            for (; i < ilen; ++i) {
                if (!isNaN(scale.getRightValue(dataset.data[i]))) {
                    rects[i].draw();
                }
            }
            helpers.canvas.unclipArea(chart.ctx);
        },
        _resolveElementOptions: function (rectangle, index) {
            var me = this;
            var chart = me.chart;
            var datasets = chart.data.datasets;
            var dataset = datasets[me.index];
            var custom = rectangle.custom || {};
            var options = chart.options.elements.rectangle;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var keys = [
                'backgroundColor',
                'borderColor',
                'borderSkipped',
                'borderWidth'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
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