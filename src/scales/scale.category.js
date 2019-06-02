define(['../core/core.scale'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Scale = __module__0;
    var defaultConfig = { position: 'bottom' };
    module.exports = Scale.extend({
        getLabels: function () {
            var data = this.chart.data;
            return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
        },
        determineDataLimits: function () {
            var me = this;
            var labels = me.getLabels();
            me.minIndex = 0;
            me.maxIndex = labels.length - 1;
            var findIndex;
            if (me.options.ticks.min !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.min);
                me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
            }
            if (me.options.ticks.max !== undefined) {
                findIndex = labels.indexOf(me.options.ticks.max);
                me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
            }
            me.min = labels[me.minIndex];
            me.max = labels[me.maxIndex];
        },
        buildTicks: function () {
            var me = this;
            var labels = me.getLabels();
            me.ticks = me.minIndex === 0 && me.maxIndex === labels.length - 1 ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
        },
        getLabelForIndex: function (index, datasetIndex) {
            var me = this;
            var chart = me.chart;
            if (chart.getDatasetMeta(datasetIndex).controller._getValueScaleId() === me.id) {
                return me.getRightValue(chart.data.datasets[datasetIndex].data[index]);
            }
            return me.ticks[index - me.minIndex];
        },
        getPixelForValue: function (value, index) {
            var me = this;
            var offset = me.options.offset;
            var offsetAmt = Math.max(me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1), 1);
            var valueCategory;
            if (value !== undefined && value !== null) {
                valueCategory = me.isHorizontal() ? value.x : value.y;
            }
            if (valueCategory !== undefined || value !== undefined && isNaN(index)) {
                var labels = me.getLabels();
                value = valueCategory || value;
                var idx = labels.indexOf(value);
                index = idx !== -1 ? idx : index;
            }
            if (me.isHorizontal()) {
                var valueWidth = me.width / offsetAmt;
                var widthOffset = valueWidth * (index - me.minIndex);
                if (offset) {
                    widthOffset += valueWidth / 2;
                }
                return me.left + widthOffset;
            }
            var valueHeight = me.height / offsetAmt;
            var heightOffset = valueHeight * (index - me.minIndex);
            if (offset) {
                heightOffset += valueHeight / 2;
            }
            return me.top + heightOffset;
        },
        getPixelForTick: function (index) {
            return this.getPixelForValue(this.ticks[index], index + this.minIndex, null);
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var offset = me.options.offset;
            var value;
            var offsetAmt = Math.max(me._ticks.length - (offset ? 0 : 1), 1);
            var horz = me.isHorizontal();
            var valueDimension = (horz ? me.width : me.height) / offsetAmt;
            pixel -= horz ? me.left : me.top;
            if (offset) {
                pixel -= valueDimension / 2;
            }
            if (pixel <= 0) {
                value = 0;
            } else {
                value = Math.round(pixel / valueDimension);
            }
            return value + me.minIndex;
        },
        getBasePixel: function () {
            return this.bottom;
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