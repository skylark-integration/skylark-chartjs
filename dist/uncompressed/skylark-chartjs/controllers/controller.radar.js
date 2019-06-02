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
    defaults._set('radar', {
        scale: { type: 'radialLinear' },
        elements: { line: { tension: 0 } }
    });
    module.exports = DatasetController.extend({
        datasetElementType: elements.Line,
        dataElementType: elements.Point,
        linkScales: helpers.noop,
        update: function (reset) {
            var me = this;
            var meta = me.getMeta();
            var line = meta.dataset;
            var points = meta.data || [];
            var scale = me.chart.scale;
            var dataset = me.getDataset();
            var i, ilen;
            if (dataset.tension !== undefined && dataset.lineTension === undefined) {
                dataset.lineTension = dataset.tension;
            }
            line._scale = scale;
            line._datasetIndex = me.index;
            line._children = points;
            line._loop = true;
            line._model = me._resolveLineOptions(line);
            line.pivot();
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                me.updateElement(points[i], i, reset);
            }
            me.updateBezierControlPoints();
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                points[i].pivot();
            }
        },
        updateElement: function (point, index, reset) {
            var me = this;
            var custom = point.custom || {};
            var dataset = me.getDataset();
            var scale = me.chart.scale;
            var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);
            var options = me._resolvePointOptions(point, index);
            var lineModel = me.getMeta().dataset._model;
            var x = reset ? scale.xCenter : pointPosition.x;
            var y = reset ? scale.yCenter : pointPosition.y;
            point._scale = scale;
            point._options = options;
            point._datasetIndex = me.index;
            point._index = index;
            point._model = {
                x: x,
                y: y,
                skip: custom.skip || isNaN(x) || isNaN(y),
                radius: options.radius,
                pointStyle: options.pointStyle,
                rotation: options.rotation,
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: options.borderWidth,
                tension: valueOrDefault(custom.tension, lineModel ? lineModel.tension : 0),
                hitRadius: options.hitRadius
            };
        },
        _resolvePointOptions: function (element, index) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options.elements.point;
            var values = {};
            var i, ilen, key;
            var context = {
                chart: chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            var ELEMENT_OPTIONS = {
                backgroundColor: 'pointBackgroundColor',
                borderColor: 'pointBorderColor',
                borderWidth: 'pointBorderWidth',
                hitRadius: 'pointHitRadius',
                hoverBackgroundColor: 'pointHoverBackgroundColor',
                hoverBorderColor: 'pointHoverBorderColor',
                hoverBorderWidth: 'pointHoverBorderWidth',
                hoverRadius: 'pointHoverRadius',
                pointStyle: 'pointStyle',
                radius: 'pointRadius',
                rotation: 'pointRotation'
            };
            var keys = Object.keys(ELEMENT_OPTIONS);
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[ELEMENT_OPTIONS[key]],
                    dataset[key],
                    options[key]
                ], context, index);
            }
            return values;
        },
        _resolveLineOptions: function (element) {
            var me = this;
            var chart = me.chart;
            var dataset = chart.data.datasets[me.index];
            var custom = element.custom || {};
            var options = chart.options.elements.line;
            var values = {};
            var i, ilen, key;
            var keys = [
                'backgroundColor',
                'borderWidth',
                'borderColor',
                'borderCapStyle',
                'borderDash',
                'borderDashOffset',
                'borderJoinStyle',
                'fill'
            ];
            for (i = 0, ilen = keys.length; i < ilen; ++i) {
                key = keys[i];
                values[key] = resolve([
                    custom[key],
                    dataset[key],
                    options[key]
                ]);
            }
            values.tension = valueOrDefault(dataset.lineTension, options.tension);
            return values;
        },
        updateBezierControlPoints: function () {
            var me = this;
            var meta = me.getMeta();
            var area = me.chart.chartArea;
            var points = meta.data || [];
            var i, ilen, model, controlPoints;
            function capControlPoint(pt, min, max) {
                return Math.max(Math.min(pt, max), min);
            }
            for (i = 0, ilen = points.length; i < ilen; ++i) {
                model = points[i]._model;
                controlPoints = helpers.splineCurve(helpers.previousItem(points, i, true)._model, model, helpers.nextItem(points, i, true)._model, model.tension);
                model.controlPointPreviousX = capControlPoint(controlPoints.previous.x, area.left, area.right);
                model.controlPointPreviousY = capControlPoint(controlPoints.previous.y, area.top, area.bottom);
                model.controlPointNextX = capControlPoint(controlPoints.next.x, area.left, area.right);
                model.controlPointNextY = capControlPoint(controlPoints.next.y, area.top, area.bottom);
            }
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
            model.radius = valueOrDefault(options.hoverRadius, options.radius);
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