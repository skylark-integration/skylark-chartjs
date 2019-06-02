define([
    './core.defaults',
    './core.element',
    '../helpers/index',
    './core.ticks'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var Ticks = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
    defaults._set('scale', {
        display: true,
        position: 'left',
        offset: false,
        gridLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
            tickMarkLength: 10,
            zeroLineWidth: 1,
            zeroLineColor: 'rgba(0,0,0,0.25)',
            zeroLineBorderDash: [],
            zeroLineBorderDashOffset: 0,
            offsetGridLines: false,
            borderDash: [],
            borderDashOffset: 0
        },
        scaleLabel: {
            display: false,
            labelString: '',
            padding: {
                top: 4,
                bottom: 4
            }
        },
        ticks: {
            beginAtZero: false,
            minRotation: 0,
            maxRotation: 50,
            mirror: false,
            padding: 0,
            reverse: false,
            display: true,
            autoSkip: true,
            autoSkipPadding: 0,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {}
        }
    });
    function labelsFromTicks(ticks) {
        var labels = [];
        var i, ilen;
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            labels.push(ticks[i].label);
        }
        return labels;
    }
    function getPixelForGridLine(scale, index, offsetGridLines) {
        var lineValue = scale.getPixelForTick(index);
        if (offsetGridLines) {
            if (scale.getTicks().length === 1) {
                lineValue -= scale.isHorizontal() ? Math.max(lineValue - scale.left, scale.right - lineValue) : Math.max(lineValue - scale.top, scale.bottom - lineValue);
            } else if (index === 0) {
                lineValue -= (scale.getPixelForTick(1) - lineValue) / 2;
            } else {
                lineValue -= (lineValue - scale.getPixelForTick(index - 1)) / 2;
            }
        }
        return lineValue;
    }
    function computeTextSize(context, tick, font) {
        return helpers.isArray(tick) ? helpers.longestText(context, font, tick) : context.measureText(tick).width;
    }
    module.exports = Element.extend({
        getPadding: function () {
            var me = this;
            return {
                left: me.paddingLeft || 0,
                top: me.paddingTop || 0,
                right: me.paddingRight || 0,
                bottom: me.paddingBottom || 0
            };
        },
        getTicks: function () {
            return this._ticks;
        },
        mergeTicksOptions: function () {
            var ticks = this.options.ticks;
            if (ticks.minor === false) {
                ticks.minor = { display: false };
            }
            if (ticks.major === false) {
                ticks.major = { display: false };
            }
            for (var key in ticks) {
                if (key !== 'major' && key !== 'minor') {
                    if (typeof ticks.minor[key] === 'undefined') {
                        ticks.minor[key] = ticks[key];
                    }
                    if (typeof ticks.major[key] === 'undefined') {
                        ticks.major[key] = ticks[key];
                    }
                }
            }
        },
        beforeUpdate: function () {
            helpers.callback(this.options.beforeUpdate, [this]);
        },
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            var i, ilen, labels, label, ticks, tick;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = helpers.extend({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, margins);
            me._maxLabelLines = 0;
            me.longestLabelWidth = 0;
            me.longestTextCache = me.longestTextCache || {};
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeDataLimits();
            me.determineDataLimits();
            me.afterDataLimits();
            me.beforeBuildTicks();
            ticks = me.buildTicks() || [];
            ticks = me.afterBuildTicks(ticks) || ticks;
            me.beforeTickToLabelConversion();
            labels = me.convertTicksToLabels(ticks) || me.ticks;
            me.afterTickToLabelConversion();
            me.ticks = labels;
            for (i = 0, ilen = labels.length; i < ilen; ++i) {
                label = labels[i];
                tick = ticks[i];
                if (!tick) {
                    ticks.push(tick = {
                        label: label,
                        major: false
                    });
                } else {
                    tick.label = label;
                }
            }
            me._ticks = ticks;
            me.beforeCalculateTickRotation();
            me.calculateTickRotation();
            me.afterCalculateTickRotation();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: function () {
            helpers.callback(this.options.afterUpdate, [this]);
        },
        beforeSetDimensions: function () {
            helpers.callback(this.options.beforeSetDimensions, [this]);
        },
        setDimensions: function () {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width;
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height;
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
        },
        afterSetDimensions: function () {
            helpers.callback(this.options.afterSetDimensions, [this]);
        },
        beforeDataLimits: function () {
            helpers.callback(this.options.beforeDataLimits, [this]);
        },
        determineDataLimits: helpers.noop,
        afterDataLimits: function () {
            helpers.callback(this.options.afterDataLimits, [this]);
        },
        beforeBuildTicks: function () {
            helpers.callback(this.options.beforeBuildTicks, [this]);
        },
        buildTicks: helpers.noop,
        afterBuildTicks: function (ticks) {
            var me = this;
            if (helpers.isArray(ticks) && ticks.length) {
                return helpers.callback(me.options.afterBuildTicks, [
                    me,
                    ticks
                ]);
            }
            me.ticks = helpers.callback(me.options.afterBuildTicks, [
                me,
                me.ticks
            ]) || me.ticks;
            return ticks;
        },
        beforeTickToLabelConversion: function () {
            helpers.callback(this.options.beforeTickToLabelConversion, [this]);
        },
        convertTicksToLabels: function () {
            var me = this;
            var tickOpts = me.options.ticks;
            me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback, this);
        },
        afterTickToLabelConversion: function () {
            helpers.callback(this.options.afterTickToLabelConversion, [this]);
        },
        beforeCalculateTickRotation: function () {
            helpers.callback(this.options.beforeCalculateTickRotation, [this]);
        },
        calculateTickRotation: function () {
            var me = this;
            var context = me.ctx;
            var tickOpts = me.options.ticks;
            var labels = labelsFromTicks(me._ticks);
            var tickFont = helpers.options._parseFont(tickOpts);
            context.font = tickFont.string;
            var labelRotation = tickOpts.minRotation || 0;
            if (labels.length && me.options.display && me.isHorizontal()) {
                var originalLabelWidth = helpers.longestText(context, tickFont.string, labels, me.longestTextCache);
                var labelWidth = originalLabelWidth;
                var cosRotation, sinRotation;
                var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;
                while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
                    var angleRadians = helpers.toRadians(labelRotation);
                    cosRotation = Math.cos(angleRadians);
                    sinRotation = Math.sin(angleRadians);
                    if (sinRotation * originalLabelWidth > me.maxHeight) {
                        labelRotation--;
                        break;
                    }
                    labelRotation++;
                    labelWidth = cosRotation * originalLabelWidth;
                }
            }
            me.labelRotation = labelRotation;
        },
        afterCalculateTickRotation: function () {
            helpers.callback(this.options.afterCalculateTickRotation, [this]);
        },
        beforeFit: function () {
            helpers.callback(this.options.beforeFit, [this]);
        },
        fit: function () {
            var me = this;
            var minSize = me.minSize = {
                width: 0,
                height: 0
            };
            var labels = labelsFromTicks(me._ticks);
            var opts = me.options;
            var tickOpts = opts.ticks;
            var scaleLabelOpts = opts.scaleLabel;
            var gridLineOpts = opts.gridLines;
            var display = me._isVisible();
            var position = opts.position;
            var isHorizontal = me.isHorizontal();
            var parseFont = helpers.options._parseFont;
            var tickFont = parseFont(tickOpts);
            var tickMarkLength = opts.gridLines.tickMarkLength;
            if (isHorizontal) {
                minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
            } else {
                minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
            }
            if (isHorizontal) {
                minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
            } else {
                minSize.height = me.maxHeight;
            }
            if (scaleLabelOpts.display && display) {
                var scaleLabelFont = parseFont(scaleLabelOpts);
                var scaleLabelPadding = helpers.options.toPadding(scaleLabelOpts.padding);
                var deltaHeight = scaleLabelFont.lineHeight + scaleLabelPadding.height;
                if (isHorizontal) {
                    minSize.height += deltaHeight;
                } else {
                    minSize.width += deltaHeight;
                }
            }
            if (tickOpts.display && display) {
                var largestTextWidth = helpers.longestText(me.ctx, tickFont.string, labels, me.longestTextCache);
                var tallestLabelHeightInLines = helpers.numberOfLabelLines(labels);
                var lineSpace = tickFont.size * 0.5;
                var tickPadding = me.options.ticks.padding;
                me._maxLabelLines = tallestLabelHeightInLines;
                me.longestLabelWidth = largestTextWidth;
                if (isHorizontal) {
                    var angleRadians = helpers.toRadians(me.labelRotation);
                    var cosRotation = Math.cos(angleRadians);
                    var sinRotation = Math.sin(angleRadians);
                    var labelHeight = sinRotation * largestTextWidth + tickFont.lineHeight * tallestLabelHeightInLines + lineSpace;
                    minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);
                    me.ctx.font = tickFont.string;
                    var firstLabelWidth = computeTextSize(me.ctx, labels[0], tickFont.string);
                    var lastLabelWidth = computeTextSize(me.ctx, labels[labels.length - 1], tickFont.string);
                    var offsetLeft = me.getPixelForTick(0) - me.left;
                    var offsetRight = me.right - me.getPixelForTick(labels.length - 1);
                    var paddingLeft, paddingRight;
                    if (me.labelRotation !== 0) {
                        paddingLeft = position === 'bottom' ? cosRotation * firstLabelWidth : cosRotation * lineSpace;
                        paddingRight = position === 'bottom' ? cosRotation * lineSpace : cosRotation * lastLabelWidth;
                    } else {
                        paddingLeft = firstLabelWidth / 2;
                        paddingRight = lastLabelWidth / 2;
                    }
                    me.paddingLeft = Math.max(paddingLeft - offsetLeft, 0) + 3;
                    me.paddingRight = Math.max(paddingRight - offsetRight, 0) + 3;
                } else {
                    if (tickOpts.mirror) {
                        largestTextWidth = 0;
                    } else {
                        largestTextWidth += tickPadding + lineSpace;
                    }
                    minSize.width = Math.min(me.maxWidth, minSize.width + largestTextWidth);
                    me.paddingTop = tickFont.size / 2;
                    me.paddingBottom = tickFont.size / 2;
                }
            }
            me.handleMargins();
            me.width = minSize.width;
            me.height = minSize.height;
        },
        handleMargins: function () {
            var me = this;
            if (me.margins) {
                me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
                me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
                me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
                me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
            }
        },
        afterFit: function () {
            helpers.callback(this.options.afterFit, [this]);
        },
        isHorizontal: function () {
            return this.options.position === 'top' || this.options.position === 'bottom';
        },
        isFullWidth: function () {
            return this.options.fullWidth;
        },
        getRightValue: function (rawValue) {
            if (helpers.isNullOrUndef(rawValue)) {
                return NaN;
            }
            if ((typeof rawValue === 'number' || rawValue instanceof Number) && !isFinite(rawValue)) {
                return NaN;
            }
            if (rawValue) {
                if (this.isHorizontal()) {
                    if (rawValue.x !== undefined) {
                        return this.getRightValue(rawValue.x);
                    }
                } else if (rawValue.y !== undefined) {
                    return this.getRightValue(rawValue.y);
                }
            }
            return rawValue;
        },
        getLabelForIndex: helpers.noop,
        getPixelForValue: helpers.noop,
        getValueForPixel: helpers.noop,
        getPixelForTick: function (index) {
            var me = this;
            var offset = me.options.offset;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
                var tickWidth = innerWidth / Math.max(me._ticks.length - (offset ? 0 : 1), 1);
                var pixel = tickWidth * index + me.paddingLeft;
                if (offset) {
                    pixel += tickWidth / 2;
                }
                var finalVal = me.left + pixel;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal;
            }
            var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
            return me.top + index * (innerHeight / (me._ticks.length - 1));
        },
        getPixelForDecimal: function (decimal) {
            var me = this;
            if (me.isHorizontal()) {
                var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
                var valueOffset = innerWidth * decimal + me.paddingLeft;
                var finalVal = me.left + valueOffset;
                finalVal += me.isFullWidth() ? me.margins.left : 0;
                return finalVal;
            }
            return me.top + decimal * me.height;
        },
        getBasePixel: function () {
            return this.getPixelForValue(this.getBaseValue());
        },
        getBaseValue: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            return me.beginAtZero ? 0 : min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
        },
        _autoSkip: function (ticks) {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var optionTicks = me.options.ticks.minor;
            var tickCount = ticks.length;
            var skipRatio = false;
            var maxTicks = optionTicks.maxTicksLimit;
            var ticksLength = me._tickSize() * (tickCount - 1);
            var axisLength = isHorizontal ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.PaddingBottom);
            var result = [];
            var i, tick;
            if (ticksLength > axisLength) {
                skipRatio = 1 + Math.floor(ticksLength / axisLength);
            }
            if (tickCount > maxTicks) {
                skipRatio = Math.max(skipRatio, 1 + Math.floor(tickCount / maxTicks));
            }
            for (i = 0; i < tickCount; i++) {
                tick = ticks[i];
                if (skipRatio > 1 && i % skipRatio > 0) {
                    delete tick.label;
                }
                result.push(tick);
            }
            return result;
        },
        _tickSize: function () {
            var me = this;
            var isHorizontal = me.isHorizontal();
            var optionTicks = me.options.ticks.minor;
            var rot = helpers.toRadians(me.labelRotation);
            var cos = Math.abs(Math.cos(rot));
            var sin = Math.abs(Math.sin(rot));
            var padding = optionTicks.autoSkipPadding || 0;
            var w = me.longestLabelWidth + padding || 0;
            var tickFont = helpers.options._parseFont(optionTicks);
            var h = me._maxLabelLines * tickFont.lineHeight + padding || 0;
            return isHorizontal ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
        },
        _isVisible: function () {
            var me = this;
            var chart = me.chart;
            var display = me.options.display;
            var i, ilen, meta;
            if (display !== 'auto') {
                return !!display;
            }
            for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                    meta = chart.getDatasetMeta(i);
                    if (meta.xAxisID === me.id || meta.yAxisID === me.id) {
                        return true;
                    }
                }
            }
            return false;
        },
        draw: function (chartArea) {
            var me = this;
            var options = me.options;
            if (!me._isVisible()) {
                return;
            }
            var chart = me.chart;
            var context = me.ctx;
            var globalDefaults = defaults.global;
            var defaultFontColor = globalDefaults.defaultFontColor;
            var optionTicks = options.ticks.minor;
            var optionMajorTicks = options.ticks.major || optionTicks;
            var gridLines = options.gridLines;
            var scaleLabel = options.scaleLabel;
            var position = options.position;
            var isRotated = me.labelRotation !== 0;
            var isMirrored = optionTicks.mirror;
            var isHorizontal = me.isHorizontal();
            var parseFont = helpers.options._parseFont;
            var ticks = optionTicks.display && optionTicks.autoSkip ? me._autoSkip(me.getTicks()) : me.getTicks();
            var tickFontColor = valueOrDefault(optionTicks.fontColor, defaultFontColor);
            var tickFont = parseFont(optionTicks);
            var lineHeight = tickFont.lineHeight;
            var majorTickFontColor = valueOrDefault(optionMajorTicks.fontColor, defaultFontColor);
            var majorTickFont = parseFont(optionMajorTicks);
            var tickPadding = optionTicks.padding;
            var labelOffset = optionTicks.labelOffset;
            var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;
            var scaleLabelFontColor = valueOrDefault(scaleLabel.fontColor, defaultFontColor);
            var scaleLabelFont = parseFont(scaleLabel);
            var scaleLabelPadding = helpers.options.toPadding(scaleLabel.padding);
            var labelRotationRadians = helpers.toRadians(me.labelRotation);
            var itemsToDraw = [];
            var axisWidth = gridLines.drawBorder ? valueAtIndexOrDefault(gridLines.lineWidth, 0, 0) : 0;
            var alignPixel = helpers._alignPixel;
            var borderValue, tickStart, tickEnd;
            if (position === 'top') {
                borderValue = alignPixel(chart, me.bottom, axisWidth);
                tickStart = me.bottom - tl;
                tickEnd = borderValue - axisWidth / 2;
            } else if (position === 'bottom') {
                borderValue = alignPixel(chart, me.top, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.top + tl;
            } else if (position === 'left') {
                borderValue = alignPixel(chart, me.right, axisWidth);
                tickStart = me.right - tl;
                tickEnd = borderValue - axisWidth / 2;
            } else {
                borderValue = alignPixel(chart, me.left, axisWidth);
                tickStart = borderValue + axisWidth / 2;
                tickEnd = me.left + tl;
            }
            var epsilon = 1e-7;
            helpers.each(ticks, function (tick, index) {
                if (helpers.isNullOrUndef(tick.label)) {
                    return;
                }
                var label = tick.label;
                var lineWidth, lineColor, borderDash, borderDashOffset;
                if (index === me.zeroLineIndex && options.offset === gridLines.offsetGridLines) {
                    lineWidth = gridLines.zeroLineWidth;
                    lineColor = gridLines.zeroLineColor;
                    borderDash = gridLines.zeroLineBorderDash || [];
                    borderDashOffset = gridLines.zeroLineBorderDashOffset || 0;
                } else {
                    lineWidth = valueAtIndexOrDefault(gridLines.lineWidth, index);
                    lineColor = valueAtIndexOrDefault(gridLines.color, index);
                    borderDash = gridLines.borderDash || [];
                    borderDashOffset = gridLines.borderDashOffset || 0;
                }
                var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY, textOffset, textAlign;
                var labelCount = helpers.isArray(label) ? label.length : 1;
                var lineValue = getPixelForGridLine(me, index, gridLines.offsetGridLines);
                if (isHorizontal) {
                    var labelYOffset = tl + tickPadding;
                    if (lineValue < me.left - epsilon) {
                        lineColor = 'rgba(0,0,0,0)';
                    }
                    tx1 = tx2 = x1 = x2 = alignPixel(chart, lineValue, lineWidth);
                    ty1 = tickStart;
                    ty2 = tickEnd;
                    labelX = me.getPixelForTick(index) + labelOffset;
                    if (position === 'top') {
                        y1 = alignPixel(chart, chartArea.top, axisWidth) + axisWidth / 2;
                        y2 = chartArea.bottom;
                        textOffset = ((!isRotated ? 0.5 : 1) - labelCount) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'left';
                        labelY = me.bottom - labelYOffset;
                    } else {
                        y1 = chartArea.top;
                        y2 = alignPixel(chart, chartArea.bottom, axisWidth) - axisWidth / 2;
                        textOffset = (!isRotated ? 0.5 : 0) * lineHeight;
                        textAlign = !isRotated ? 'center' : 'right';
                        labelY = me.top + labelYOffset;
                    }
                } else {
                    var labelXOffset = (isMirrored ? 0 : tl) + tickPadding;
                    if (lineValue < me.top - epsilon) {
                        lineColor = 'rgba(0,0,0,0)';
                    }
                    tx1 = tickStart;
                    tx2 = tickEnd;
                    ty1 = ty2 = y1 = y2 = alignPixel(chart, lineValue, lineWidth);
                    labelY = me.getPixelForTick(index) + labelOffset;
                    textOffset = (1 - labelCount) * lineHeight / 2;
                    if (position === 'left') {
                        x1 = alignPixel(chart, chartArea.left, axisWidth) + axisWidth / 2;
                        x2 = chartArea.right;
                        textAlign = isMirrored ? 'left' : 'right';
                        labelX = me.right - labelXOffset;
                    } else {
                        x1 = chartArea.left;
                        x2 = alignPixel(chart, chartArea.right, axisWidth) - axisWidth / 2;
                        textAlign = isMirrored ? 'right' : 'left';
                        labelX = me.left + labelXOffset;
                    }
                }
                itemsToDraw.push({
                    tx1: tx1,
                    ty1: ty1,
                    tx2: tx2,
                    ty2: ty2,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    labelX: labelX,
                    labelY: labelY,
                    glWidth: lineWidth,
                    glColor: lineColor,
                    glBorderDash: borderDash,
                    glBorderDashOffset: borderDashOffset,
                    rotation: -1 * labelRotationRadians,
                    label: label,
                    major: tick.major,
                    textOffset: textOffset,
                    textAlign: textAlign
                });
            });
            helpers.each(itemsToDraw, function (itemToDraw) {
                var glWidth = itemToDraw.glWidth;
                var glColor = itemToDraw.glColor;
                if (gridLines.display && glWidth && glColor) {
                    context.save();
                    context.lineWidth = glWidth;
                    context.strokeStyle = glColor;
                    if (context.setLineDash) {
                        context.setLineDash(itemToDraw.glBorderDash);
                        context.lineDashOffset = itemToDraw.glBorderDashOffset;
                    }
                    context.beginPath();
                    if (gridLines.drawTicks) {
                        context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
                        context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
                    }
                    if (gridLines.drawOnChartArea) {
                        context.moveTo(itemToDraw.x1, itemToDraw.y1);
                        context.lineTo(itemToDraw.x2, itemToDraw.y2);
                    }
                    context.stroke();
                    context.restore();
                }
                if (optionTicks.display) {
                    context.save();
                    context.translate(itemToDraw.labelX, itemToDraw.labelY);
                    context.rotate(itemToDraw.rotation);
                    context.font = itemToDraw.major ? majorTickFont.string : tickFont.string;
                    context.fillStyle = itemToDraw.major ? majorTickFontColor : tickFontColor;
                    context.textBaseline = 'middle';
                    context.textAlign = itemToDraw.textAlign;
                    var label = itemToDraw.label;
                    var y = itemToDraw.textOffset;
                    if (helpers.isArray(label)) {
                        for (var i = 0; i < label.length; ++i) {
                            context.fillText('' + label[i], 0, y);
                            y += lineHeight;
                        }
                    } else {
                        context.fillText(label, 0, y);
                    }
                    context.restore();
                }
            });
            if (scaleLabel.display) {
                var scaleLabelX;
                var scaleLabelY;
                var rotation = 0;
                var halfLineHeight = scaleLabelFont.lineHeight / 2;
                if (isHorizontal) {
                    scaleLabelX = me.left + (me.right - me.left) / 2;
                    scaleLabelY = position === 'bottom' ? me.bottom - halfLineHeight - scaleLabelPadding.bottom : me.top + halfLineHeight + scaleLabelPadding.top;
                } else {
                    var isLeft = position === 'left';
                    scaleLabelX = isLeft ? me.left + halfLineHeight + scaleLabelPadding.top : me.right - halfLineHeight - scaleLabelPadding.top;
                    scaleLabelY = me.top + (me.bottom - me.top) / 2;
                    rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
                }
                context.save();
                context.translate(scaleLabelX, scaleLabelY);
                context.rotate(rotation);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = scaleLabelFontColor;
                context.font = scaleLabelFont.string;
                context.fillText(scaleLabel.labelString, 0, 0);
                context.restore();
            }
            if (axisWidth) {
                var firstLineWidth = axisWidth;
                var lastLineWidth = valueAtIndexOrDefault(gridLines.lineWidth, ticks.length - 1, 0);
                var x1, x2, y1, y2;
                if (isHorizontal) {
                    x1 = alignPixel(chart, me.left, firstLineWidth) - firstLineWidth / 2;
                    x2 = alignPixel(chart, me.right, lastLineWidth) + lastLineWidth / 2;
                    y1 = y2 = borderValue;
                } else {
                    y1 = alignPixel(chart, me.top, firstLineWidth) - firstLineWidth / 2;
                    y2 = alignPixel(chart, me.bottom, lastLineWidth) + lastLineWidth / 2;
                    x1 = x2 = borderValue;
                }
                context.lineWidth = axisWidth;
                context.strokeStyle = valueAtIndexOrDefault(gridLines.color, 0);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
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