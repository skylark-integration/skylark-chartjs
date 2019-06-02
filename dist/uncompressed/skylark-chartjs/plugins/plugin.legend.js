define([
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index',
    '../core/core.layouts'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var layouts = __module__3;
    var noop = helpers.noop;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        legend: {
            display: true,
            position: 'top',
            fullWidth: true,
            reverse: false,
            weight: 1000,
            onClick: function (e, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;
                var meta = ci.getDatasetMeta(index);
                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                ci.update();
            },
            onHover: null,
            onLeave: null,
            labels: {
                boxWidth: 40,
                padding: 10,
                generateLabels: function (chart) {
                    var data = chart.data;
                    return helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
                        return {
                            text: dataset.label,
                            fillStyle: !helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0],
                            hidden: !chart.isDatasetVisible(i),
                            lineCap: dataset.borderCapStyle,
                            lineDash: dataset.borderDash,
                            lineDashOffset: dataset.borderDashOffset,
                            lineJoin: dataset.borderJoinStyle,
                            lineWidth: dataset.borderWidth,
                            strokeStyle: dataset.borderColor,
                            pointStyle: dataset.pointStyle,
                            datasetIndex: i
                        };
                    }, this) : [];
                }
            }
        },
        legendCallback: function (chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            for (var i = 0; i < chart.data.datasets.length; i++) {
                text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
                if (chart.data.datasets[i].label) {
                    text.push(chart.data.datasets[i].label);
                }
                text.push('</li>');
            }
            text.push('</ul>');
            return text.join('');
        }
    });
    function getBoxWidth(labelOpts, fontSize) {
        return labelOpts.usePointStyle && labelOpts.boxWidth > fontSize ? fontSize : labelOpts.boxWidth;
    }
    var Legend = Element.extend({
        initialize: function (config) {
            helpers.extend(this, config);
            this.legendHitBoxes = [];
            this._hoveredItem = null;
            this.doughnutMode = false;
        },
        beforeUpdate: noop,
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: noop,
        beforeSetDimensions: noop,
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
            me.minSize = {
                width: 0,
                height: 0
            };
        },
        afterSetDimensions: noop,
        beforeBuildLabels: noop,
        buildLabels: function () {
            var me = this;
            var labelOpts = me.options.labels || {};
            var legendItems = helpers.callback(labelOpts.generateLabels, [me.chart], me) || [];
            if (labelOpts.filter) {
                legendItems = legendItems.filter(function (item) {
                    return labelOpts.filter(item, me.chart.data);
                });
            }
            if (me.options.reverse) {
                legendItems.reverse();
            }
            me.legendItems = legendItems;
        },
        afterBuildLabels: noop,
        beforeFit: noop,
        fit: function () {
            var me = this;
            var opts = me.options;
            var labelOpts = opts.labels;
            var display = opts.display;
            var ctx = me.ctx;
            var labelFont = helpers.options._parseFont(labelOpts);
            var fontSize = labelFont.size;
            var hitboxes = me.legendHitBoxes = [];
            var minSize = me.minSize;
            var isHorizontal = me.isHorizontal();
            if (isHorizontal) {
                minSize.width = me.maxWidth;
                minSize.height = display ? 10 : 0;
            } else {
                minSize.width = display ? 10 : 0;
                minSize.height = me.maxHeight;
            }
            if (display) {
                ctx.font = labelFont.string;
                if (isHorizontal) {
                    var lineWidths = me.lineWidths = [0];
                    var totalHeight = 0;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    helpers.each(me.legendItems, function (legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize);
                        var width = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        if (i === 0 || lineWidths[lineWidths.length - 1] + width + labelOpts.padding > minSize.width) {
                            totalHeight += fontSize + labelOpts.padding;
                            lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = labelOpts.padding;
                        }
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: width,
                            height: fontSize
                        };
                        lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
                    });
                    minSize.height += totalHeight;
                } else {
                    var vPadding = labelOpts.padding;
                    var columnWidths = me.columnWidths = [];
                    var totalWidth = labelOpts.padding;
                    var currentColWidth = 0;
                    var currentColHeight = 0;
                    var itemHeight = fontSize + vPadding;
                    helpers.each(me.legendItems, function (legendItem, i) {
                        var boxWidth = getBoxWidth(labelOpts, fontSize);
                        var itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        if (i > 0 && currentColHeight + itemHeight > minSize.height - vPadding) {
                            totalWidth += currentColWidth + labelOpts.padding;
                            columnWidths.push(currentColWidth);
                            currentColWidth = 0;
                            currentColHeight = 0;
                        }
                        currentColWidth = Math.max(currentColWidth, itemWidth);
                        currentColHeight += itemHeight;
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: itemWidth,
                            height: fontSize
                        };
                    });
                    totalWidth += currentColWidth;
                    columnWidths.push(currentColWidth);
                    minSize.width += totalWidth;
                }
            }
            me.width = minSize.width;
            me.height = minSize.height;
        },
        afterFit: noop,
        isHorizontal: function () {
            return this.options.position === 'top' || this.options.position === 'bottom';
        },
        draw: function () {
            var me = this;
            var opts = me.options;
            var labelOpts = opts.labels;
            var globalDefaults = defaults.global;
            var defaultColor = globalDefaults.defaultColor;
            var lineDefault = globalDefaults.elements.line;
            var legendWidth = me.width;
            var lineWidths = me.lineWidths;
            if (opts.display) {
                var ctx = me.ctx;
                var fontColor = valueOrDefault(labelOpts.fontColor, globalDefaults.defaultFontColor);
                var labelFont = helpers.options._parseFont(labelOpts);
                var fontSize = labelFont.size;
                var cursor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = fontColor;
                ctx.fillStyle = fontColor;
                ctx.font = labelFont.string;
                var boxWidth = getBoxWidth(labelOpts, fontSize);
                var hitboxes = me.legendHitBoxes;
                var drawLegendBox = function (x, y, legendItem) {
                    if (isNaN(boxWidth) || boxWidth <= 0) {
                        return;
                    }
                    ctx.save();
                    var lineWidth = valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
                    ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
                    ctx.lineCap = valueOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
                    ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
                    ctx.lineJoin = valueOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
                    if (ctx.setLineDash) {
                        ctx.setLineDash(valueOrDefault(legendItem.lineDash, lineDefault.borderDash));
                    }
                    if (opts.labels && opts.labels.usePointStyle) {
                        var radius = boxWidth * Math.SQRT2 / 2;
                        var centerX = x + boxWidth / 2;
                        var centerY = y + fontSize / 2;
                        helpers.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
                    } else {
                        if (lineWidth !== 0) {
                            ctx.strokeRect(x, y, boxWidth, fontSize);
                        }
                        ctx.fillRect(x, y, boxWidth, fontSize);
                    }
                    ctx.restore();
                };
                var fillText = function (x, y, legendItem, textWidth) {
                    var halfFontSize = fontSize / 2;
                    var xLeft = boxWidth + halfFontSize + x;
                    var yMiddle = y + halfFontSize;
                    ctx.fillText(legendItem.text, xLeft, yMiddle);
                    if (legendItem.hidden) {
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.moveTo(xLeft, yMiddle);
                        ctx.lineTo(xLeft + textWidth, yMiddle);
                        ctx.stroke();
                    }
                };
                var isHorizontal = me.isHorizontal();
                if (isHorizontal) {
                    cursor = {
                        x: me.left + (legendWidth - lineWidths[0]) / 2 + labelOpts.padding,
                        y: me.top + labelOpts.padding,
                        line: 0
                    };
                } else {
                    cursor = {
                        x: me.left + labelOpts.padding,
                        y: me.top + labelOpts.padding,
                        line: 0
                    };
                }
                var itemHeight = fontSize + labelOpts.padding;
                helpers.each(me.legendItems, function (legendItem, i) {
                    var textWidth = ctx.measureText(legendItem.text).width;
                    var width = boxWidth + fontSize / 2 + textWidth;
                    var x = cursor.x;
                    var y = cursor.y;
                    if (isHorizontal) {
                        if (i > 0 && x + width + labelOpts.padding > me.left + me.minSize.width) {
                            y = cursor.y += itemHeight;
                            cursor.line++;
                            x = cursor.x = me.left + (legendWidth - lineWidths[cursor.line]) / 2 + labelOpts.padding;
                        }
                    } else if (i > 0 && y + itemHeight > me.top + me.minSize.height) {
                        x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
                        y = cursor.y = me.top + labelOpts.padding;
                        cursor.line++;
                    }
                    drawLegendBox(x, y, legendItem);
                    hitboxes[i].left = x;
                    hitboxes[i].top = y;
                    fillText(x, y, legendItem, textWidth);
                    if (isHorizontal) {
                        cursor.x += width + labelOpts.padding;
                    } else {
                        cursor.y += itemHeight;
                    }
                });
            }
        },
        _getLegendItemAt: function (x, y) {
            var me = this;
            var i, hitBox, lh;
            if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
                lh = me.legendHitBoxes;
                for (i = 0; i < lh.length; ++i) {
                    hitBox = lh[i];
                    if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
                        return me.legendItems[i];
                    }
                }
            }
            return null;
        },
        handleEvent: function (e) {
            var me = this;
            var opts = me.options;
            var type = e.type === 'mouseup' ? 'click' : e.type;
            var hoveredItem;
            if (type === 'mousemove') {
                if (!opts.onHover && !opts.onLeave) {
                    return;
                }
            } else if (type === 'click') {
                if (!opts.onClick) {
                    return;
                }
            } else {
                return;
            }
            hoveredItem = me._getLegendItemAt(e.x, e.y);
            if (type === 'click') {
                if (hoveredItem && opts.onClick) {
                    opts.onClick.call(me, e.native, hoveredItem);
                }
            } else {
                if (opts.onLeave && hoveredItem !== me._hoveredItem) {
                    if (me._hoveredItem) {
                        opts.onLeave.call(me, e.native, me._hoveredItem);
                    }
                    me._hoveredItem = hoveredItem;
                }
                if (opts.onHover && hoveredItem) {
                    opts.onHover.call(me, e.native, hoveredItem);
                }
            }
        }
    });
    function createNewLegendAndAttach(chart, legendOpts) {
        var legend = new Legend({
            ctx: chart.ctx,
            options: legendOpts,
            chart: chart
        });
        layouts.configure(chart, legend, legendOpts);
        layouts.addBox(chart, legend);
        chart.legend = legend;
    }
    module.exports = {
        id: 'legend',
        _element: Legend,
        beforeInit: function (chart) {
            var legendOpts = chart.options.legend;
            if (legendOpts) {
                createNewLegendAndAttach(chart, legendOpts);
            }
        },
        beforeUpdate: function (chart) {
            var legendOpts = chart.options.legend;
            var legend = chart.legend;
            if (legendOpts) {
                helpers.mergeIf(legendOpts, defaults.global.legend);
                if (legend) {
                    layouts.configure(chart, legend, legendOpts);
                    legend.options = legendOpts;
                } else {
                    createNewLegendAndAttach(chart, legendOpts);
                }
            } else if (legend) {
                layouts.removeBox(chart, legend);
                delete chart.legend;
            }
        },
        afterEvent: function (chart, e) {
            var legend = chart.legend;
            if (legend) {
                legend.handleEvent(e);
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