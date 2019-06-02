define([
    '../core/core.defaults',
    '../helpers/index',
    './scale.linearbase',
    '../core/core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var LinearScaleBase = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    var resolve = helpers.options.resolve;
    var defaultConfig = {
        display: true,
        animate: true,
        position: 'chartArea',
        angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0
        },
        gridLines: { circular: false },
        ticks: {
            showLabelBackdrop: true,
            backdropColor: 'rgba(255,255,255,0.75)',
            backdropPaddingY: 2,
            backdropPaddingX: 2,
            callback: Ticks.formatters.linear
        },
        pointLabels: {
            display: true,
            fontSize: 10,
            callback: function (label) {
                return label;
            }
        }
    };
    function getValueCount(scale) {
        var opts = scale.options;
        return opts.angleLines.display || opts.pointLabels.display ? scale.chart.data.labels.length : 0;
    }
    function getTickBackdropHeight(opts) {
        var tickOpts = opts.ticks;
        if (tickOpts.display && opts.display) {
            return valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize) + tickOpts.backdropPaddingY * 2;
        }
        return 0;
    }
    function measureLabelSize(ctx, lineHeight, label) {
        if (helpers.isArray(label)) {
            return {
                w: helpers.longestText(ctx, ctx.font, label),
                h: label.length * lineHeight
            };
        }
        return {
            w: ctx.measureText(label).width,
            h: lineHeight
        };
    }
    function determineLimits(angle, pos, size, min, max) {
        if (angle === min || angle === max) {
            return {
                start: pos - size / 2,
                end: pos + size / 2
            };
        } else if (angle < min || angle > max) {
            return {
                start: pos - size,
                end: pos
            };
        }
        return {
            start: pos,
            end: pos + size
        };
    }
    function fitWithPointLabels(scale) {
        var plFont = helpers.options._parseFont(scale.options.pointLabels);
        var furthestLimits = {
            l: 0,
            r: scale.width,
            t: 0,
            b: scale.height - scale.paddingTop
        };
        var furthestAngles = {};
        var i, textSize, pointPosition;
        scale.ctx.font = plFont.string;
        scale._pointLabelSizes = [];
        var valueCount = getValueCount(scale);
        for (i = 0; i < valueCount; i++) {
            pointPosition = scale.getPointPosition(i, scale.drawingArea + 5);
            textSize = measureLabelSize(scale.ctx, plFont.lineHeight, scale.pointLabels[i] || '');
            scale._pointLabelSizes[i] = textSize;
            var angleRadians = scale.getIndexAngle(i);
            var angle = helpers.toDegrees(angleRadians) % 360;
            var hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
            var vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
            if (hLimits.start < furthestLimits.l) {
                furthestLimits.l = hLimits.start;
                furthestAngles.l = angleRadians;
            }
            if (hLimits.end > furthestLimits.r) {
                furthestLimits.r = hLimits.end;
                furthestAngles.r = angleRadians;
            }
            if (vLimits.start < furthestLimits.t) {
                furthestLimits.t = vLimits.start;
                furthestAngles.t = angleRadians;
            }
            if (vLimits.end > furthestLimits.b) {
                furthestLimits.b = vLimits.end;
                furthestAngles.b = angleRadians;
            }
        }
        scale.setReductions(scale.drawingArea, furthestLimits, furthestAngles);
    }
    function getTextAlignForAngle(angle) {
        if (angle === 0 || angle === 180) {
            return 'center';
        } else if (angle < 180) {
            return 'left';
        }
        return 'right';
    }
    function fillText(ctx, text, position, lineHeight) {
        var y = position.y + lineHeight / 2;
        var i, ilen;
        if (helpers.isArray(text)) {
            for (i = 0, ilen = text.length; i < ilen; ++i) {
                ctx.fillText(text[i], position.x, y);
                y += lineHeight;
            }
        } else {
            ctx.fillText(text, position.x, y);
        }
    }
    function adjustPointPositionForLabelHeight(angle, textSize, position) {
        if (angle === 90 || angle === 270) {
            position.y -= textSize.h / 2;
        } else if (angle > 270 || angle < 90) {
            position.y -= textSize.h;
        }
    }
    function drawPointLabels(scale) {
        var ctx = scale.ctx;
        var opts = scale.options;
        var angleLineOpts = opts.angleLines;
        var gridLineOpts = opts.gridLines;
        var pointLabelOpts = opts.pointLabels;
        var lineWidth = valueOrDefault(angleLineOpts.lineWidth, gridLineOpts.lineWidth);
        var lineColor = valueOrDefault(angleLineOpts.color, gridLineOpts.color);
        var tickBackdropHeight = getTickBackdropHeight(opts);
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        if (ctx.setLineDash) {
            ctx.setLineDash(resolve([
                angleLineOpts.borderDash,
                gridLineOpts.borderDash,
                []
            ]));
            ctx.lineDashOffset = resolve([
                angleLineOpts.borderDashOffset,
                gridLineOpts.borderDashOffset,
                0
            ]);
        }
        var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);
        var plFont = helpers.options._parseFont(pointLabelOpts);
        ctx.font = plFont.string;
        ctx.textBaseline = 'middle';
        for (var i = getValueCount(scale) - 1; i >= 0; i--) {
            if (angleLineOpts.display && lineWidth && lineColor) {
                var outerPosition = scale.getPointPosition(i, outerDistance);
                ctx.beginPath();
                ctx.moveTo(scale.xCenter, scale.yCenter);
                ctx.lineTo(outerPosition.x, outerPosition.y);
                ctx.stroke();
            }
            if (pointLabelOpts.display) {
                var extra = i === 0 ? tickBackdropHeight / 2 : 0;
                var pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + 5);
                var pointLabelFontColor = valueAtIndexOrDefault(pointLabelOpts.fontColor, i, defaults.global.defaultFontColor);
                ctx.fillStyle = pointLabelFontColor;
                var angleRadians = scale.getIndexAngle(i);
                var angle = helpers.toDegrees(angleRadians);
                ctx.textAlign = getTextAlignForAngle(angle);
                adjustPointPositionForLabelHeight(angle, scale._pointLabelSizes[i], pointLabelPosition);
                fillText(ctx, scale.pointLabels[i] || '', pointLabelPosition, plFont.lineHeight);
            }
        }
        ctx.restore();
    }
    function drawRadiusLine(scale, gridLineOpts, radius, index) {
        var ctx = scale.ctx;
        var circular = gridLineOpts.circular;
        var valueCount = getValueCount(scale);
        var lineColor = valueAtIndexOrDefault(gridLineOpts.color, index - 1);
        var lineWidth = valueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);
        var pointPosition;
        if (!circular && !valueCount || !lineColor || !lineWidth) {
            return;
        }
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        if (ctx.setLineDash) {
            ctx.setLineDash(gridLineOpts.borderDash || []);
            ctx.lineDashOffset = gridLineOpts.borderDashOffset || 0;
        }
        ctx.beginPath();
        if (circular) {
            ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2);
        } else {
            pointPosition = scale.getPointPosition(0, radius);
            ctx.moveTo(pointPosition.x, pointPosition.y);
            for (var i = 1; i < valueCount; i++) {
                pointPosition = scale.getPointPosition(i, radius);
                ctx.lineTo(pointPosition.x, pointPosition.y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    function numberOrZero(param) {
        return helpers.isNumber(param) ? param : 0;
    }
    module.exports = LinearScaleBase.extend({
        setDimensions: function () {
            var me = this;
            me.width = me.maxWidth;
            me.height = me.maxHeight;
            me.paddingTop = getTickBackdropHeight(me.options) / 2;
            me.xCenter = Math.floor(me.width / 2);
            me.yCenter = Math.floor((me.height - me.paddingTop) / 2);
            me.drawingArea = Math.min(me.height - me.paddingTop, me.width) / 2;
        },
        determineDataLimits: function () {
            var me = this;
            var chart = me.chart;
            var min = Number.POSITIVE_INFINITY;
            var max = Number.NEGATIVE_INFINITY;
            helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
                if (chart.isDatasetVisible(datasetIndex)) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    helpers.each(dataset.data, function (rawValue, index) {
                        var value = +me.getRightValue(rawValue);
                        if (isNaN(value) || meta.data[index].hidden) {
                            return;
                        }
                        min = Math.min(value, min);
                        max = Math.max(value, max);
                    });
                }
            });
            me.min = min === Number.POSITIVE_INFINITY ? 0 : min;
            me.max = max === Number.NEGATIVE_INFINITY ? 0 : max;
            me.handleTickRangeOptions();
        },
        _computeTickLimit: function () {
            return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
        },
        convertTicksToLabels: function () {
            var me = this;
            LinearScaleBase.prototype.convertTicksToLabels.call(me);
            me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
        },
        getLabelForIndex: function (index, datasetIndex) {
            return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
        },
        fit: function () {
            var me = this;
            var opts = me.options;
            if (opts.display && opts.pointLabels.display) {
                fitWithPointLabels(me);
            } else {
                me.setCenterPoint(0, 0, 0, 0);
            }
        },
        setReductions: function (largestPossibleRadius, furthestLimits, furthestAngles) {
            var me = this;
            var radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
            var radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r);
            var radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
            var radiusReductionBottom = -Math.max(furthestLimits.b - (me.height - me.paddingTop), 0) / Math.cos(furthestAngles.b);
            radiusReductionLeft = numberOrZero(radiusReductionLeft);
            radiusReductionRight = numberOrZero(radiusReductionRight);
            radiusReductionTop = numberOrZero(radiusReductionTop);
            radiusReductionBottom = numberOrZero(radiusReductionBottom);
            me.drawingArea = Math.min(Math.floor(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2), Math.floor(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2));
            me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
        },
        setCenterPoint: function (leftMovement, rightMovement, topMovement, bottomMovement) {
            var me = this;
            var maxRight = me.width - rightMovement - me.drawingArea;
            var maxLeft = leftMovement + me.drawingArea;
            var maxTop = topMovement + me.drawingArea;
            var maxBottom = me.height - me.paddingTop - bottomMovement - me.drawingArea;
            me.xCenter = Math.floor((maxLeft + maxRight) / 2 + me.left);
            me.yCenter = Math.floor((maxTop + maxBottom) / 2 + me.top + me.paddingTop);
        },
        getIndexAngle: function (index) {
            var angleMultiplier = Math.PI * 2 / getValueCount(this);
            var startAngle = this.chart.options && this.chart.options.startAngle ? this.chart.options.startAngle : 0;
            var startAngleRadians = startAngle * Math.PI * 2 / 360;
            return index * angleMultiplier + startAngleRadians;
        },
        getDistanceFromCenterForValue: function (value) {
            var me = this;
            if (value === null) {
                return 0;
            }
            var scalingFactor = me.drawingArea / (me.max - me.min);
            if (me.options.ticks.reverse) {
                return (me.max - value) * scalingFactor;
            }
            return (value - me.min) * scalingFactor;
        },
        getPointPosition: function (index, distanceFromCenter) {
            var me = this;
            var thisAngle = me.getIndexAngle(index) - Math.PI / 2;
            return {
                x: Math.cos(thisAngle) * distanceFromCenter + me.xCenter,
                y: Math.sin(thisAngle) * distanceFromCenter + me.yCenter
            };
        },
        getPointPositionForValue: function (index, value) {
            return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
        },
        getBasePosition: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            return me.getPointPositionForValue(0, me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0);
        },
        draw: function () {
            var me = this;
            var opts = me.options;
            var gridLineOpts = opts.gridLines;
            var tickOpts = opts.ticks;
            if (opts.display) {
                var ctx = me.ctx;
                var startAngle = this.getIndexAngle(0);
                var tickFont = helpers.options._parseFont(tickOpts);
                if (opts.angleLines.display || opts.pointLabels.display) {
                    drawPointLabels(me);
                }
                helpers.each(me.ticks, function (label, index) {
                    if (index > 0 || tickOpts.reverse) {
                        var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
                        if (gridLineOpts.display && index !== 0) {
                            drawRadiusLine(me, gridLineOpts, yCenterOffset, index);
                        }
                        if (tickOpts.display) {
                            var tickFontColor = valueOrDefault(tickOpts.fontColor, defaults.global.defaultFontColor);
                            ctx.font = tickFont.string;
                            ctx.save();
                            ctx.translate(me.xCenter, me.yCenter);
                            ctx.rotate(startAngle);
                            if (tickOpts.showLabelBackdrop) {
                                var labelWidth = ctx.measureText(label).width;
                                ctx.fillStyle = tickOpts.backdropColor;
                                ctx.fillRect(-labelWidth / 2 - tickOpts.backdropPaddingX, -yCenterOffset - tickFont.size / 2 - tickOpts.backdropPaddingY, labelWidth + tickOpts.backdropPaddingX * 2, tickFont.size + tickOpts.backdropPaddingY * 2);
                            }
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = tickFontColor;
                            ctx.fillText(label, 0, -yCenterOffset);
                            ctx.restore();
                        }
                    }
                });
            }
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