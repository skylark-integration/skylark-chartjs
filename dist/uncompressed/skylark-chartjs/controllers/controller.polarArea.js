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
    defaults._set('polarArea', {
        scale: {
            type: 'radialLinear',
            angleLines: { display: false },
            gridLines: { circular: true },
            pointLabels: { display: false },
            ticks: { beginAtZero: true }
        },
        animation: {
            animateRotate: true,
            animateScale: true
        },
        startAngle: -0.5 * Math.PI,
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            var data = chart.data;
            var datasets = data.datasets;
            var labels = data.labels;
            if (datasets.length) {
                for (var i = 0; i < datasets[0].data.length; ++i) {
                    text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
                    if (labels[i]) {
                        text.push(labels[i]);
                    }
                    text.push('</li>');
                }
            }
            text.push('</ul>');
            return text.join('');
        },
        legend: {
            labels: {
                generateLabels: function (chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function (label, i) {
                            var meta = chart.getDatasetMeta(0);
                            var ds = data.datasets[0];
                            var arc = meta.data[i];
                            var custom = arc.custom || {};
                            var arcOpts = chart.options.elements.arc;
                            var fill = resolve([
                                custom.backgroundColor,
                                ds.backgroundColor,
                                arcOpts.backgroundColor
                            ], undefined, i);
                            var stroke = resolve([
                                custom.borderColor,
                                ds.borderColor,
                                arcOpts.borderColor
                            ], undefined, i);
                            var bw = resolve([
                                custom.borderWidth,
                                ds.borderWidth,
                                arcOpts.borderWidth
                            ], undefined, i);
                            return {
                                text: label,
                                fillStyle: fill,
                                strokeStyle: stroke,
                                lineWidth: bw,
                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                index: i
                            };
                        });
                    }
                    return [];
                }
            },
            onClick: function (e, legendItem) {
                var index = legendItem.index;
                var chart = this.chart;
                var i, ilen, meta;
                for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                    meta = chart.getDatasetMeta(i);
                    meta.data[index].hidden = !meta.data[index].hidden;
                }
                chart.update();
            }
        },
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item, data) {
                    return data.labels[item.index] + ': ' + item.yLabel;
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers.noop,
        update: function (reset) {
            var me = this;
            var dataset = me.getDataset();
            var meta = me.getMeta();
            var start = me.chart.options.startAngle || 0;
            var starts = me._starts = [];
            var angles = me._angles = [];
            var arcs = meta.data;
            var i, ilen, angle;
            me._updateRadius();
            meta.count = me.countVisibleElements();
            for (i = 0, ilen = dataset.data.length; i < ilen; i++) {
                starts[i] = start;
                angle = me._computeAngle(i);
                angles[i] = angle;
                start += angle;
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arcs[i]._options = me._resolveElementOptions(arcs[i], i);
                me.updateElement(arcs[i], i, reset);
            }
        },
        _updateRadius: function () {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            chart.outerRadius = Math.max(minSize / 2, 0);
            chart.innerRadius = Math.max(opts.cutoutPercentage ? chart.outerRadius / 100 * opts.cutoutPercentage : 1, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
            me.outerRadius = chart.outerRadius - chart.radiusLength * me.index;
            me.innerRadius = me.outerRadius - chart.radiusLength;
        },
        updateElement: function (arc, index, reset) {
            var me = this;
            var chart = me.chart;
            var dataset = me.getDataset();
            var opts = chart.options;
            var animationOpts = opts.animation;
            var scale = chart.scale;
            var labels = chart.data.labels;
            var centerX = scale.xCenter;
            var centerY = scale.yCenter;
            var datasetStartAngle = opts.startAngle;
            var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
            var startAngle = me._starts[index];
            var endAngle = startAngle + (arc.hidden ? 0 : me._angles[index]);
            var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
            var options = arc._options || {};
            helpers.extend(arc, {
                _datasetIndex: me.index,
                _index: index,
                _scale: scale,
                _model: {
                    backgroundColor: options.backgroundColor,
                    borderColor: options.borderColor,
                    borderWidth: options.borderWidth,
                    borderAlign: options.borderAlign,
                    x: centerX,
                    y: centerY,
                    innerRadius: 0,
                    outerRadius: reset ? resetRadius : distance,
                    startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
                    endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
                    label: helpers.valueAtIndexOrDefault(labels, index, labels[index])
                }
            });
            arc.pivot();
        },
        countVisibleElements: function () {
            var dataset = this.getDataset();
            var meta = this.getMeta();
            var count = 0;
            helpers.each(meta.data, function (element, index) {
                if (!isNaN(dataset.data[index]) && !element.hidden) {
                    count++;
                }
            });
            return count;
        },
        setHoverStyle: function (arc) {
            var model = arc._model;
            var options = arc._options;
            var getHoverColor = helpers.getHoverColor;
            var valueOrDefault = helpers.valueOrDefault;
            arc.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth
            };
            model.backgroundColor = valueOrDefault(options.hoverBackgroundColor, getHoverColor(options.backgroundColor));
            model.borderColor = valueOrDefault(options.hoverBorderColor, getHoverColor(options.borderColor));
            model.borderWidth = valueOrDefault(options.hoverBorderWidth, options.borderWidth);
        },
        _resolveElementOptions: function (arc, index) {
            var me = this;
            var chart = me.chart;
            var dataset = me.getDataset();
            var custom = arc.custom || {};
            var options = chart.options.elements.arc;
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
                'borderAlign',
                'hoverBackgroundColor',
                'hoverBorderColor',
                'hoverBorderWidth'
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
        },
        _computeAngle: function (index) {
            var me = this;
            var count = this.getMeta().count;
            var dataset = me.getDataset();
            var meta = me.getMeta();
            if (isNaN(dataset.data[index]) || meta.data[index].hidden) {
                return 0;
            }
            var context = {
                chart: me.chart,
                dataIndex: index,
                dataset: dataset,
                datasetIndex: me.index
            };
            return resolve([
                me.chart.options.elements.arc.angle,
                2 * Math.PI / count
            ], context, index);
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