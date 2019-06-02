define([
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    function filterByPosition(array, position) {
        return helpers.where(array, function (v) {
            return v.position === position;
        });
    }
    function sortByWeight(array, reverse) {
        array.forEach(function (v, i) {
            v._tmpIndex_ = i;
            return v;
        });
        array.sort(function (a, b) {
            var v0 = reverse ? b : a;
            var v1 = reverse ? a : b;
            return v0.weight === v1.weight ? v0._tmpIndex_ - v1._tmpIndex_ : v0.weight - v1.weight;
        });
        array.forEach(function (v) {
            delete v._tmpIndex_;
        });
    }
    function findMaxPadding(boxes) {
        var top = 0;
        var left = 0;
        var bottom = 0;
        var right = 0;
        helpers.each(boxes, function (box) {
            if (box.getPadding) {
                var boxPadding = box.getPadding();
                top = Math.max(top, boxPadding.top);
                left = Math.max(left, boxPadding.left);
                bottom = Math.max(bottom, boxPadding.bottom);
                right = Math.max(right, boxPadding.right);
            }
        });
        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right
        };
    }
    function addSizeByPosition(boxes, size) {
        helpers.each(boxes, function (box) {
            size[box.position] += box.isHorizontal() ? box.height : box.width;
        });
    }
    defaults._set('global', {
        layout: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    });
    module.exports = {
        defaults: {},
        addBox: function (chart, item) {
            if (!chart.boxes) {
                chart.boxes = [];
            }
            item.fullWidth = item.fullWidth || false;
            item.position = item.position || 'top';
            item.weight = item.weight || 0;
            chart.boxes.push(item);
        },
        removeBox: function (chart, layoutItem) {
            var index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
            if (index !== -1) {
                chart.boxes.splice(index, 1);
            }
        },
        configure: function (chart, item, options) {
            var props = [
                'fullWidth',
                'position',
                'weight'
            ];
            var ilen = props.length;
            var i = 0;
            var prop;
            for (; i < ilen; ++i) {
                prop = props[i];
                if (options.hasOwnProperty(prop)) {
                    item[prop] = options[prop];
                }
            }
        },
        update: function (chart, width, height) {
            if (!chart) {
                return;
            }
            var layoutOptions = chart.options.layout || {};
            var padding = helpers.options.toPadding(layoutOptions.padding);
            var leftPadding = padding.left;
            var rightPadding = padding.right;
            var topPadding = padding.top;
            var bottomPadding = padding.bottom;
            var leftBoxes = filterByPosition(chart.boxes, 'left');
            var rightBoxes = filterByPosition(chart.boxes, 'right');
            var topBoxes = filterByPosition(chart.boxes, 'top');
            var bottomBoxes = filterByPosition(chart.boxes, 'bottom');
            var chartAreaBoxes = filterByPosition(chart.boxes, 'chartArea');
            sortByWeight(leftBoxes, true);
            sortByWeight(rightBoxes, false);
            sortByWeight(topBoxes, true);
            sortByWeight(bottomBoxes, false);
            var verticalBoxes = leftBoxes.concat(rightBoxes);
            var horizontalBoxes = topBoxes.concat(bottomBoxes);
            var outerBoxes = verticalBoxes.concat(horizontalBoxes);
            var chartWidth = width - leftPadding - rightPadding;
            var chartHeight = height - topPadding - bottomPadding;
            var chartAreaWidth = chartWidth / 2;
            var verticalBoxWidth = (width - chartAreaWidth) / verticalBoxes.length;
            var maxChartAreaWidth = chartWidth;
            var maxChartAreaHeight = chartHeight;
            var outerBoxSizes = {
                top: topPadding,
                left: leftPadding,
                bottom: bottomPadding,
                right: rightPadding
            };
            var minBoxSizes = [];
            var maxPadding;
            function getMinimumBoxSize(box) {
                var minSize;
                var isHorizontal = box.isHorizontal();
                if (isHorizontal) {
                    minSize = box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2);
                    maxChartAreaHeight -= minSize.height;
                } else {
                    minSize = box.update(verticalBoxWidth, maxChartAreaHeight);
                    maxChartAreaWidth -= minSize.width;
                }
                minBoxSizes.push({
                    horizontal: isHorizontal,
                    width: minSize.width,
                    box: box
                });
            }
            helpers.each(outerBoxes, getMinimumBoxSize);
            maxPadding = findMaxPadding(outerBoxes);
            function fitBox(box) {
                var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minBox) {
                    return minBox.box === box;
                });
                if (minBoxSize) {
                    if (minBoxSize.horizontal) {
                        var scaleMargin = {
                            left: Math.max(outerBoxSizes.left, maxPadding.left),
                            right: Math.max(outerBoxSizes.right, maxPadding.right),
                            top: 0,
                            bottom: 0
                        };
                        box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
                    } else {
                        box.update(minBoxSize.width, maxChartAreaHeight);
                    }
                }
            }
            helpers.each(verticalBoxes, fitBox);
            addSizeByPosition(verticalBoxes, outerBoxSizes);
            helpers.each(horizontalBoxes, fitBox);
            addSizeByPosition(horizontalBoxes, outerBoxSizes);
            function finalFitVerticalBox(box) {
                var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minSize) {
                    return minSize.box === box;
                });
                var scaleMargin = {
                    left: 0,
                    right: 0,
                    top: outerBoxSizes.top,
                    bottom: outerBoxSizes.bottom
                };
                if (minBoxSize) {
                    box.update(minBoxSize.width, maxChartAreaHeight, scaleMargin);
                }
            }
            helpers.each(verticalBoxes, finalFitVerticalBox);
            outerBoxSizes = {
                top: topPadding,
                left: leftPadding,
                bottom: bottomPadding,
                right: rightPadding
            };
            addSizeByPosition(outerBoxes, outerBoxSizes);
            var leftPaddingAddition = Math.max(maxPadding.left - outerBoxSizes.left, 0);
            outerBoxSizes.left += leftPaddingAddition;
            outerBoxSizes.right += Math.max(maxPadding.right - outerBoxSizes.right, 0);
            var topPaddingAddition = Math.max(maxPadding.top - outerBoxSizes.top, 0);
            outerBoxSizes.top += topPaddingAddition;
            outerBoxSizes.bottom += Math.max(maxPadding.bottom - outerBoxSizes.bottom, 0);
            var newMaxChartAreaHeight = height - outerBoxSizes.top - outerBoxSizes.bottom;
            var newMaxChartAreaWidth = width - outerBoxSizes.left - outerBoxSizes.right;
            if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
                helpers.each(verticalBoxes, function (box) {
                    box.height = newMaxChartAreaHeight;
                });
                helpers.each(horizontalBoxes, function (box) {
                    if (!box.fullWidth) {
                        box.width = newMaxChartAreaWidth;
                    }
                });
                maxChartAreaHeight = newMaxChartAreaHeight;
                maxChartAreaWidth = newMaxChartAreaWidth;
            }
            var left = leftPadding + leftPaddingAddition;
            var top = topPadding + topPaddingAddition;
            function placeBox(box) {
                if (box.isHorizontal()) {
                    box.left = box.fullWidth ? leftPadding : outerBoxSizes.left;
                    box.right = box.fullWidth ? width - rightPadding : outerBoxSizes.left + maxChartAreaWidth;
                    box.top = top;
                    box.bottom = top + box.height;
                    top = box.bottom;
                } else {
                    box.left = left;
                    box.right = left + box.width;
                    box.top = outerBoxSizes.top;
                    box.bottom = outerBoxSizes.top + maxChartAreaHeight;
                    left = box.right;
                }
            }
            helpers.each(leftBoxes.concat(topBoxes), placeBox);
            left += maxChartAreaWidth;
            top += maxChartAreaHeight;
            helpers.each(rightBoxes, placeBox);
            helpers.each(bottomBoxes, placeBox);
            chart.chartArea = {
                left: outerBoxSizes.left,
                top: outerBoxSizes.top,
                right: outerBoxSizes.left + maxChartAreaWidth,
                bottom: outerBoxSizes.top + maxChartAreaHeight
            };
            helpers.each(chartAreaBoxes, function (box) {
                box.left = chart.chartArea.left;
                box.top = chart.chartArea.top;
                box.right = chart.chartArea.right;
                box.bottom = chart.chartArea.bottom;
                box.update(maxChartAreaWidth, maxChartAreaHeight);
            });
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