define(['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    function getRelativePosition(e, chart) {
        if (e.native) {
            return {
                x: e.x,
                y: e.y
            };
        }
        return helpers.getRelativePosition(e, chart);
    }
    function parseVisibleItems(chart, handler) {
        var datasets = chart.data.datasets;
        var meta, i, j, ilen, jlen;
        for (i = 0, ilen = datasets.length; i < ilen; ++i) {
            if (!chart.isDatasetVisible(i)) {
                continue;
            }
            meta = chart.getDatasetMeta(i);
            for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
                var element = meta.data[j];
                if (!element._view.skip) {
                    handler(element);
                }
            }
        }
    }
    function getIntersectItems(chart, position) {
        var elements = [];
        parseVisibleItems(chart, function (element) {
            if (element.inRange(position.x, position.y)) {
                elements.push(element);
            }
        });
        return elements;
    }
    function getNearestItems(chart, position, intersect, distanceMetric) {
        var minDistance = Number.POSITIVE_INFINITY;
        var nearestItems = [];
        parseVisibleItems(chart, function (element) {
            if (intersect && !element.inRange(position.x, position.y)) {
                return;
            }
            var center = element.getCenterPoint();
            var distance = distanceMetric(position, center);
            if (distance < minDistance) {
                nearestItems = [element];
                minDistance = distance;
            } else if (distance === minDistance) {
                nearestItems.push(element);
            }
        });
        return nearestItems;
    }
    function getDistanceMetricForAxis(axis) {
        var useX = axis.indexOf('x') !== -1;
        var useY = axis.indexOf('y') !== -1;
        return function (pt1, pt2) {
            var deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
            var deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        };
    }
    function indexMode(chart, e, options) {
        var position = getRelativePosition(e, chart);
        options.axis = options.axis || 'x';
        var distanceMetric = getDistanceMetricForAxis(options.axis);
        var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
        var elements = [];
        if (!items.length) {
            return [];
        }
        chart.data.datasets.forEach(function (dataset, datasetIndex) {
            if (chart.isDatasetVisible(datasetIndex)) {
                var meta = chart.getDatasetMeta(datasetIndex);
                var element = meta.data[items[0]._index];
                if (element && !element._view.skip) {
                    elements.push(element);
                }
            }
        });
        return elements;
    }
    module.exports = {
        modes: {
            single: function (chart, e) {
                var position = getRelativePosition(e, chart);
                var elements = [];
                parseVisibleItems(chart, function (element) {
                    if (element.inRange(position.x, position.y)) {
                        elements.push(element);
                        return elements;
                    }
                });
                return elements.slice(0, 1);
            },
            label: indexMode,
            index: indexMode,
            dataset: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis);
                var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
                if (items.length > 0) {
                    items = chart.getDatasetMeta(items[0]._datasetIndex).data;
                }
                return items;
            },
            'x-axis': function (chart, e) {
                return indexMode(chart, e, { intersect: false });
            },
            point: function (chart, e) {
                var position = getRelativePosition(e, chart);
                return getIntersectItems(chart, position);
            },
            nearest: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                options.axis = options.axis || 'xy';
                var distanceMetric = getDistanceMetricForAxis(options.axis);
                return getNearestItems(chart, position, options.intersect, distanceMetric);
            },
            x: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                var items = [];
                var intersectsItem = false;
                parseVisibleItems(chart, function (element) {
                    if (element.inXRange(position.x)) {
                        items.push(element);
                    }
                    if (element.inRange(position.x, position.y)) {
                        intersectsItem = true;
                    }
                });
                if (options.intersect && !intersectsItem) {
                    items = [];
                }
                return items;
            },
            y: function (chart, e, options) {
                var position = getRelativePosition(e, chart);
                var items = [];
                var intersectsItem = false;
                parseVisibleItems(chart, function (element) {
                    if (element.inYRange(position.y)) {
                        items.push(element);
                    }
                    if (element.inRange(position.x, position.y)) {
                        intersectsItem = true;
                    }
                });
                if (options.intersect && !intersectsItem) {
                    items = [];
                }
                return items;
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