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
    var valueOrDefault = helpers.valueOrDefault;
    var resolve = helpers.options.resolve;
    defaults._set('bubble', {
        hover: { mode: 'single' },
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    id: 'x-axis-0'
                }],
            yAxes: [{
                    type: 'linear',
                    position: 'left',
                    id: 'y-axis-0'
                }]
        },
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item, data) {
                    var datasetLabel = data.datasets[item.datasetIndex].label || '';
                    var dataPoint = data.datasets[item.datasetIndex].data[item.index];
                    return datasetLabel + ': (' + item.xLabel + ', ' + item.yLabel + ', ' + dataPoint.r + ')';
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Point,
        update: function (reset) {
            var me = this;
            var meta = me.getMeta();
            var points = meta.data;
            helpers.each(points, function (point, index) {
                me.updateElement(point, index, reset);
            });
        },
        updateElement: function (point, index, reset) {
            var me = this;
            var meta = me.getMeta();
            var custom = point.custom || {};
            var xScale = me.getScaleForId(meta.xAxisID);
            var yScale = me.getScaleForId(meta.yAxisID);
            var options = me._resolveElementOptions(point, index);
            var data = me.getDataset().data[index];
            var dsIndex = me.index;
            var x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex);
            var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);
            point._xScale = xScale;
            point._yScale = yScale;
            point._options = options;
            point._datasetIndex = dsIndex;
            point._index = index;
            point._model = {
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: options.borderWidth,
                hitRadius: options.hitRadius,
                pointStyle: options.pointStyle,
                rotation: options.rotation,
                radius: reset ? 0 : options.radius,
                skip: custom.skip || isNaN(x) || isNaN(y),
                x: x,
                y: y
            };
            point.pivot();
        },
        setHoverStyle: function (point) {
            var model = point._model;
            var options = point._options;
            var getHoverColor = helpers.getHoverColor;
            point.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth,
                radius: model.radius
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
            model.radius = options.radius + options.hoverRadius;
        },
        _resolveElementOptions: function (point, index) {
            var me = this;
            var chart = me.chart;
            var datasets = chart.data.datasets;
            var dataset = datasets[me.index];
            var custom = point.custom || {};
            var options = chart.options.elements.point;
            var data = dataset.data[index];
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
                'borderWidth',
                'hoverBackgroundColor',
                'hoverBorderColor',
                'hoverBorderWidth',
                'hoverRadius',
                'hitRadius',
                'pointStyle',
                'rotation'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            values.radius = resolve([
                custom.radius,
                data ? data.r : undefined,
                dataset.radius,
                options.radius
            ], context, index);
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