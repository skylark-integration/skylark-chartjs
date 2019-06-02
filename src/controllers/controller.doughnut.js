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
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('doughnut', {
        animation: {
            animateRotate: true,
            animateScale: false
        },
        hover: { mode: 'single' },
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
                            var custom = arc && arc.custom || {};
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
                    if (meta.data[index]) {
                        meta.data[index].hidden = !meta.data[index].hidden;
                    }
                }
                chart.update();
            }
        },
        cutoutPercentage: 50,
        rotation: Math.PI * -0.5,
        circumference: Math.PI * 2,
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (tooltipItem, data) {
                    var dataLabel = data.labels[tooltipItem.index];
                    var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    if (helpers.isArray(dataLabel)) {
                        dataLabel = dataLabel.slice();
                        dataLabel[0] += value;
                    } else {
                        dataLabel += value;
                    }
                    return dataLabel;
                }
            }
        }
    });
    module.exports = DatasetController.extend({
        dataElementType: elements.Arc,
        linkScales: helpers.noop,
        getRingIndex: function (datasetIndex) {
            var ringIndex = 0;
            for (var j = 0; j < datasetIndex; ++j) {
                if (this.chart.isDatasetVisible(j)) {
                    ++ringIndex;
                }
            }
            return ringIndex;
        },
        update: function (reset) {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var availableWidth = chartArea.right - chartArea.left;
            var availableHeight = chartArea.bottom - chartArea.top;
            var minSize = Math.min(availableWidth, availableHeight);
            var offset = {
                x: 0,
                y: 0
            };
            var meta = me.getMeta();
            var arcs = meta.data;
            var cutoutPercentage = opts.cutoutPercentage;
            var circumference = opts.circumference;
            var chartWeight = me._getRingWeight(me.index);
            var i, ilen;
            if (circumference < Math.PI * 2) {
                var startAngle = opts.rotation % (Math.PI * 2);
                startAngle += Math.PI * 2 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
                var endAngle = startAngle + circumference;
                var start = {
                    x: Math.cos(startAngle),
                    y: Math.sin(startAngle)
                };
                var end = {
                    x: Math.cos(endAngle),
                    y: Math.sin(endAngle)
                };
                var contains0 = startAngle <= 0 && endAngle >= 0 || startAngle <= Math.PI * 2 && Math.PI * 2 <= endAngle;
                var contains90 = startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle;
                var contains180 = startAngle <= -Math.PI && -Math.PI <= endAngle || startAngle <= Math.PI && Math.PI <= endAngle;
                var contains270 = startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle || startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle;
                var cutout = cutoutPercentage / 100;
                var min = {
                    x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)),
                    y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))
                };
                var max = {
                    x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)),
                    y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))
                };
                var size = {
                    width: (max.x - min.x) * 0.5,
                    height: (max.y - min.y) * 0.5
                };
                minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
                offset = {
                    x: (max.x + min.x) * -0.5,
                    y: (max.y + min.y) * -0.5
                };
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arcs[i]._options = me._resolveElementOptions(arcs[i], i);
            }
            chart.borderWidth = me.getMaxBorderWidth();
            chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
            chart.innerRadius = Math.max(cutoutPercentage ? chart.outerRadius / 100 * cutoutPercentage : 0, 0);
            chart.radiusLength = (chart.outerRadius - chart.innerRadius) / (me._getVisibleDatasetWeightTotal() || 1);
            chart.offsetX = offset.x * chart.outerRadius;
            chart.offsetY = offset.y * chart.outerRadius;
            meta.total = me.calculateTotal();
            me.outerRadius = chart.outerRadius - chart.radiusLength * me._getRingWeightOffset(me.index);
            me.innerRadius = Math.max(me.outerRadius - chart.radiusLength * chartWeight, 0);
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                me.updateElement(arcs[i], i, reset);
            }
        },
        updateElement: function (arc, index, reset) {
            var me = this;
            var chart = me.chart;
            var chartArea = chart.chartArea;
            var opts = chart.options;
            var animationOpts = opts.animation;
            var centerX = (chartArea.left + chartArea.right) / 2;
            var centerY = (chartArea.top + chartArea.bottom) / 2;
            var startAngle = opts.rotation;
            var endAngle = opts.rotation;
            var dataset = me.getDataset();
            var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2 * Math.PI));
            var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
            var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;
            var options = arc._options || {};
            helpers.extend(arc, {
                _datasetIndex: me.index,
                _index: index,
                _model: {
                    backgroundColor: options.backgroundColor,
                    borderColor: options.borderColor,
                    borderWidth: options.borderWidth,
                    borderAlign: options.borderAlign,
                    x: centerX + chart.offsetX,
                    y: centerY + chart.offsetY,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    circumference: circumference,
                    outerRadius: outerRadius,
                    innerRadius: innerRadius,
                    label: helpers.valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
                }
            });
            var model = arc._model;
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
                }
                model.endAngle = model.startAngle + model.circumference;
            }
            arc.pivot();
        },
        calculateTotal: function () {
            var dataset = this.getDataset();
            var meta = this.getMeta();
            var total = 0;
            var value;
            helpers.each(meta.data, function (element, index) {
                value = dataset.data[index];
                if (!isNaN(value) && !element.hidden) {
                    total += Math.abs(value);
                }
            });
            return total;
        },
        calculateCircumference: function (value) {
            var total = this.getMeta().total;
            if (total > 0 && !isNaN(value)) {
                return Math.PI * 2 * (Math.abs(value) / total);
            }
            return 0;
        },
        getMaxBorderWidth: function (arcs) {
            var me = this;
            var max = 0;
            var chart = me.chart;
            var i, ilen, meta, arc, controller, options, borderWidth, hoverWidth;
            if (!arcs) {
                for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                    if (chart.isDatasetVisible(i)) {
                        meta = chart.getDatasetMeta(i);
                        arcs = meta.data;
                        if (i !== me.index) {
                            controller = meta.controller;
                        }
                        break;
                    }
                }
            }
            if (!arcs) {
                return 0;
            }
            for (i = 0, ilen = arcs.length; i < ilen; ++i) {
                arc = arcs[i];
                options = controller ? controller._resolveElementOptions(arc, i) : arc._options;
                if (options.borderAlign !== 'inner') {
                    borderWidth = options.borderWidth;
                    hoverWidth = options.hoverBorderWidth;
                    max = borderWidth > max ? borderWidth : max;
                    max = hoverWidth > max ? hoverWidth : max;
                }
            }
            return max;
        },
        setHoverStyle: function (arc) {
            var model = arc._model;
            var options = arc._options;
            var getHoverColor = helpers.getHoverColor;
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
        _getRingWeightOffset: function (datasetIndex) {
            var ringWeightOffset = 0;
            for (var i = 0; i < datasetIndex; ++i) {
                if (this.chart.isDatasetVisible(i)) {
                    ringWeightOffset += this._getRingWeight(i);
                }
            }
            return ringWeightOffset;
        },
        _getRingWeight: function (dataSetIndex) {
            return Math.max(valueOrDefault(this.chart.data.datasets[dataSetIndex].weight, 1), 0);
        },
        _getVisibleDatasetWeightTotal: function () {
            return this._getRingWeightOffset(this.chart.data.datasets.length);
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