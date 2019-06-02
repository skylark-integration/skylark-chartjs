define([
    './core.defaults',
    './core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        tooltips: {
            enabled: true,
            custom: null,
            mode: 'nearest',
            position: 'average',
            intersect: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFontStyle: 'bold',
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleFontColor: '#fff',
            titleAlign: 'left',
            bodySpacing: 2,
            bodyFontColor: '#fff',
            bodyAlign: 'left',
            footerFontStyle: 'bold',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFontColor: '#fff',
            footerAlign: 'left',
            yPadding: 6,
            xPadding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            multiKeyBackground: '#fff',
            displayColors: true,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            callbacks: {
                beforeTitle: helpers.noop,
                title: function (tooltipItems, data) {
                    var title = '';
                    var labels = data.labels;
                    var labelCount = labels ? labels.length : 0;
                    if (tooltipItems.length > 0) {
                        var item = tooltipItems[0];
                        if (item.label) {
                            title = item.label;
                        } else if (item.xLabel) {
                            title = item.xLabel;
                        } else if (labelCount > 0 && item.index < labelCount) {
                            title = labels[item.index];
                        }
                    }
                    return title;
                },
                afterTitle: helpers.noop,
                beforeBody: helpers.noop,
                beforeLabel: helpers.noop,
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (!helpers.isNullOrUndef(tooltipItem.value)) {
                        label += tooltipItem.value;
                    } else {
                        label += tooltipItem.yLabel;
                    }
                    return label;
                },
                labelColor: function (tooltipItem, chart) {
                    var meta = chart.getDatasetMeta(tooltipItem.datasetIndex);
                    var activeElement = meta.data[tooltipItem.index];
                    var view = activeElement._view;
                    return {
                        borderColor: view.borderColor,
                        backgroundColor: view.backgroundColor
                    };
                },
                labelTextColor: function () {
                    return this._options.bodyFontColor;
                },
                afterLabel: helpers.noop,
                afterBody: helpers.noop,
                beforeFooter: helpers.noop,
                footer: helpers.noop,
                afterFooter: helpers.noop
            }
        }
    });
    var positioners = {
        average: function (elements) {
            if (!elements.length) {
                return false;
            }
            var i, len;
            var x = 0;
            var y = 0;
            var count = 0;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var pos = el.tooltipPosition();
                    x += pos.x;
                    y += pos.y;
                    ++count;
                }
            }
            return {
                x: x / count,
                y: y / count
            };
        },
        nearest: function (elements, eventPosition) {
            var x = eventPosition.x;
            var y = eventPosition.y;
            var minDistance = Number.POSITIVE_INFINITY;
            var i, len, nearestElement;
            for (i = 0, len = elements.length; i < len; ++i) {
                var el = elements[i];
                if (el && el.hasValue()) {
                    var center = el.getCenterPoint();
                    var d = helpers.distanceBetweenPoints(eventPosition, center);
                    if (d < minDistance) {
                        minDistance = d;
                        nearestElement = el;
                    }
                }
            }
            if (nearestElement) {
                var tp = nearestElement.tooltipPosition();
                x = tp.x;
                y = tp.y;
            }
            return {
                x: x,
                y: y
            };
        }
    };
    function pushOrConcat(base, toPush) {
        if (toPush) {
            if (helpers.isArray(toPush)) {
                Array.prototype.push.apply(base, toPush);
            } else {
                base.push(toPush);
            }
        }
        return base;
    }
    function splitNewlines(str) {
        if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
            return str.split('\n');
        }
        return str;
    }
    function createTooltipItem(element) {
        var xScale = element._xScale;
        var yScale = element._yScale || element._scale;
        var index = element._index;
        var datasetIndex = element._datasetIndex;
        var controller = element._chart.getDatasetMeta(datasetIndex).controller;
        var indexScale = controller._getIndexScale();
        var valueScale = controller._getValueScale();
        return {
            xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
            yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
            label: indexScale ? '' + indexScale.getLabelForIndex(index, datasetIndex) : '',
            value: valueScale ? '' + valueScale.getLabelForIndex(index, datasetIndex) : '',
            index: index,
            datasetIndex: datasetIndex,
            x: element._model.x,
            y: element._model.y
        };
    }
    function getBaseModel(tooltipOpts) {
        var globalDefaults = defaults.global;
        return {
            xPadding: tooltipOpts.xPadding,
            yPadding: tooltipOpts.yPadding,
            xAlign: tooltipOpts.xAlign,
            yAlign: tooltipOpts.yAlign,
            bodyFontColor: tooltipOpts.bodyFontColor,
            _bodyFontFamily: valueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
            _bodyFontStyle: valueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
            _bodyAlign: tooltipOpts.bodyAlign,
            bodyFontSize: valueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
            bodySpacing: tooltipOpts.bodySpacing,
            titleFontColor: tooltipOpts.titleFontColor,
            _titleFontFamily: valueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
            _titleFontStyle: valueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
            titleFontSize: valueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
            _titleAlign: tooltipOpts.titleAlign,
            titleSpacing: tooltipOpts.titleSpacing,
            titleMarginBottom: tooltipOpts.titleMarginBottom,
            footerFontColor: tooltipOpts.footerFontColor,
            _footerFontFamily: valueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
            _footerFontStyle: valueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
            footerFontSize: valueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
            _footerAlign: tooltipOpts.footerAlign,
            footerSpacing: tooltipOpts.footerSpacing,
            footerMarginTop: tooltipOpts.footerMarginTop,
            caretSize: tooltipOpts.caretSize,
            cornerRadius: tooltipOpts.cornerRadius,
            backgroundColor: tooltipOpts.backgroundColor,
            opacity: 0,
            legendColorBackground: tooltipOpts.multiKeyBackground,
            displayColors: tooltipOpts.displayColors,
            borderColor: tooltipOpts.borderColor,
            borderWidth: tooltipOpts.borderWidth
        };
    }
    function getTooltipSize(tooltip, model) {
        var ctx = tooltip._chart.ctx;
        var height = model.yPadding * 2;
        var width = 0;
        var body = model.body;
        var combinedBodyLength = body.reduce(function (count, bodyItem) {
            return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
        }, 0);
        combinedBodyLength += model.beforeBody.length + model.afterBody.length;
        var titleLineCount = model.title.length;
        var footerLineCount = model.footer.length;
        var titleFontSize = model.titleFontSize;
        var bodyFontSize = model.bodyFontSize;
        var footerFontSize = model.footerFontSize;
        height += titleLineCount * titleFontSize;
        height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0;
        height += titleLineCount ? model.titleMarginBottom : 0;
        height += combinedBodyLength * bodyFontSize;
        height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0;
        height += footerLineCount ? model.footerMarginTop : 0;
        height += footerLineCount * footerFontSize;
        height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0;
        var widthPadding = 0;
        var maxLineWidth = function (line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding);
        };
        ctx.font = helpers.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
        helpers.each(model.title, maxLineWidth);
        ctx.font = helpers.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
        helpers.each(model.beforeBody.concat(model.afterBody), maxLineWidth);
        widthPadding = model.displayColors ? bodyFontSize + 2 : 0;
        helpers.each(body, function (bodyItem) {
            helpers.each(bodyItem.before, maxLineWidth);
            helpers.each(bodyItem.lines, maxLineWidth);
            helpers.each(bodyItem.after, maxLineWidth);
        });
        widthPadding = 0;
        ctx.font = helpers.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
        helpers.each(model.footer, maxLineWidth);
        width += 2 * model.xPadding;
        return {
            width: width,
            height: height
        };
    }
    function determineAlignment(tooltip, size) {
        var model = tooltip._model;
        var chart = tooltip._chart;
        var chartArea = tooltip._chart.chartArea;
        var xAlign = 'center';
        var yAlign = 'center';
        if (model.y < size.height) {
            yAlign = 'top';
        } else if (model.y > chart.height - size.height) {
            yAlign = 'bottom';
        }
        var lf, rf;
        var olf, orf;
        var yf;
        var midX = (chartArea.left + chartArea.right) / 2;
        var midY = (chartArea.top + chartArea.bottom) / 2;
        if (yAlign === 'center') {
            lf = function (x) {
                return x <= midX;
            };
            rf = function (x) {
                return x > midX;
            };
        } else {
            lf = function (x) {
                return x <= size.width / 2;
            };
            rf = function (x) {
                return x >= chart.width - size.width / 2;
            };
        }
        olf = function (x) {
            return x + size.width + model.caretSize + model.caretPadding > chart.width;
        };
        orf = function (x) {
            return x - size.width - model.caretSize - model.caretPadding < 0;
        };
        yf = function (y) {
            return y <= midY ? 'top' : 'bottom';
        };
        if (lf(model.x)) {
            xAlign = 'left';
            if (olf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y);
            }
        } else if (rf(model.x)) {
            xAlign = 'right';
            if (orf(model.x)) {
                xAlign = 'center';
                yAlign = yf(model.y);
            }
        }
        var opts = tooltip._options;
        return {
            xAlign: opts.xAlign ? opts.xAlign : xAlign,
            yAlign: opts.yAlign ? opts.yAlign : yAlign
        };
    }
    function getBackgroundPoint(vm, size, alignment, chart) {
        var x = vm.x;
        var y = vm.y;
        var caretSize = vm.caretSize;
        var caretPadding = vm.caretPadding;
        var cornerRadius = vm.cornerRadius;
        var xAlign = alignment.xAlign;
        var yAlign = alignment.yAlign;
        var paddingAndSize = caretSize + caretPadding;
        var radiusAndPadding = cornerRadius + caretPadding;
        if (xAlign === 'right') {
            x -= size.width;
        } else if (xAlign === 'center') {
            x -= size.width / 2;
            if (x + size.width > chart.width) {
                x = chart.width - size.width;
            }
            if (x < 0) {
                x = 0;
            }
        }
        if (yAlign === 'top') {
            y += paddingAndSize;
        } else if (yAlign === 'bottom') {
            y -= size.height + paddingAndSize;
        } else {
            y -= size.height / 2;
        }
        if (yAlign === 'center') {
            if (xAlign === 'left') {
                x += paddingAndSize;
            } else if (xAlign === 'right') {
                x -= paddingAndSize;
            }
        } else if (xAlign === 'left') {
            x -= radiusAndPadding;
        } else if (xAlign === 'right') {
            x += radiusAndPadding;
        }
        return {
            x: x,
            y: y
        };
    }
    function getAlignedX(vm, align) {
        return align === 'center' ? vm.x + vm.width / 2 : align === 'right' ? vm.x + vm.width - vm.xPadding : vm.x + vm.xPadding;
    }
    function getBeforeAfterBodyLines(callback) {
        return pushOrConcat([], splitNewlines(callback));
    }
    var exports = Element.extend({
        initialize: function () {
            this._model = getBaseModel(this._options);
            this._lastActive = [];
        },
        getTitle: function () {
            var me = this;
            var opts = me._options;
            var callbacks = opts.callbacks;
            var beforeTitle = callbacks.beforeTitle.apply(me, arguments);
            var title = callbacks.title.apply(me, arguments);
            var afterTitle = callbacks.afterTitle.apply(me, arguments);
            var lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeTitle));
            lines = pushOrConcat(lines, splitNewlines(title));
            lines = pushOrConcat(lines, splitNewlines(afterTitle));
            return lines;
        },
        getBeforeBody: function () {
            return getBeforeAfterBodyLines(this._options.callbacks.beforeBody.apply(this, arguments));
        },
        getBody: function (tooltipItems, data) {
            var me = this;
            var callbacks = me._options.callbacks;
            var bodyItems = [];
            helpers.each(tooltipItems, function (tooltipItem) {
                var bodyItem = {
                    before: [],
                    lines: [],
                    after: []
                };
                pushOrConcat(bodyItem.before, splitNewlines(callbacks.beforeLabel.call(me, tooltipItem, data)));
                pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
                pushOrConcat(bodyItem.after, splitNewlines(callbacks.afterLabel.call(me, tooltipItem, data)));
                bodyItems.push(bodyItem);
            });
            return bodyItems;
        },
        getAfterBody: function () {
            return getBeforeAfterBodyLines(this._options.callbacks.afterBody.apply(this, arguments));
        },
        getFooter: function () {
            var me = this;
            var callbacks = me._options.callbacks;
            var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
            var footer = callbacks.footer.apply(me, arguments);
            var afterFooter = callbacks.afterFooter.apply(me, arguments);
            var lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeFooter));
            lines = pushOrConcat(lines, splitNewlines(footer));
            lines = pushOrConcat(lines, splitNewlines(afterFooter));
            return lines;
        },
        update: function (changed) {
            var me = this;
            var opts = me._options;
            var existingModel = me._model;
            var model = me._model = getBaseModel(opts);
            var active = me._active;
            var data = me._data;
            var alignment = {
                xAlign: existingModel.xAlign,
                yAlign: existingModel.yAlign
            };
            var backgroundPoint = {
                x: existingModel.x,
                y: existingModel.y
            };
            var tooltipSize = {
                width: existingModel.width,
                height: existingModel.height
            };
            var tooltipPosition = {
                x: existingModel.caretX,
                y: existingModel.caretY
            };
            var i, len;
            if (active.length) {
                model.opacity = 1;
                var labelColors = [];
                var labelTextColors = [];
                tooltipPosition = positioners[opts.position].call(me, active, me._eventPosition);
                var tooltipItems = [];
                for (i = 0, len = active.length; i < len; ++i) {
                    tooltipItems.push(createTooltipItem(active[i]));
                }
                if (opts.filter) {
                    tooltipItems = tooltipItems.filter(function (a) {
                        return opts.filter(a, data);
                    });
                }
                if (opts.itemSort) {
                    tooltipItems = tooltipItems.sort(function (a, b) {
                        return opts.itemSort(a, b, data);
                    });
                }
                helpers.each(tooltipItems, function (tooltipItem) {
                    labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, me._chart));
                    labelTextColors.push(opts.callbacks.labelTextColor.call(me, tooltipItem, me._chart));
                });
                model.title = me.getTitle(tooltipItems, data);
                model.beforeBody = me.getBeforeBody(tooltipItems, data);
                model.body = me.getBody(tooltipItems, data);
                model.afterBody = me.getAfterBody(tooltipItems, data);
                model.footer = me.getFooter(tooltipItems, data);
                model.x = tooltipPosition.x;
                model.y = tooltipPosition.y;
                model.caretPadding = opts.caretPadding;
                model.labelColors = labelColors;
                model.labelTextColors = labelTextColors;
                model.dataPoints = tooltipItems;
                tooltipSize = getTooltipSize(this, model);
                alignment = determineAlignment(this, tooltipSize);
                backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment, me._chart);
            } else {
                model.opacity = 0;
            }
            model.xAlign = alignment.xAlign;
            model.yAlign = alignment.yAlign;
            model.x = backgroundPoint.x;
            model.y = backgroundPoint.y;
            model.width = tooltipSize.width;
            model.height = tooltipSize.height;
            model.caretX = tooltipPosition.x;
            model.caretY = tooltipPosition.y;
            me._model = model;
            if (changed && opts.custom) {
                opts.custom.call(me, model);
            }
            return me;
        },
        drawCaret: function (tooltipPoint, size) {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var caretPosition = this.getCaretPosition(tooltipPoint, size, vm);
            ctx.lineTo(caretPosition.x1, caretPosition.y1);
            ctx.lineTo(caretPosition.x2, caretPosition.y2);
            ctx.lineTo(caretPosition.x3, caretPosition.y3);
        },
        getCaretPosition: function (tooltipPoint, size, vm) {
            var x1, x2, x3, y1, y2, y3;
            var caretSize = vm.caretSize;
            var cornerRadius = vm.cornerRadius;
            var xAlign = vm.xAlign;
            var yAlign = vm.yAlign;
            var ptX = tooltipPoint.x;
            var ptY = tooltipPoint.y;
            var width = size.width;
            var height = size.height;
            if (yAlign === 'center') {
                y2 = ptY + height / 2;
                if (xAlign === 'left') {
                    x1 = ptX;
                    x2 = x1 - caretSize;
                    x3 = x1;
                    y1 = y2 + caretSize;
                    y3 = y2 - caretSize;
                } else {
                    x1 = ptX + width;
                    x2 = x1 + caretSize;
                    x3 = x1;
                    y1 = y2 - caretSize;
                    y3 = y2 + caretSize;
                }
            } else {
                if (xAlign === 'left') {
                    x2 = ptX + cornerRadius + caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                } else if (xAlign === 'right') {
                    x2 = ptX + width - cornerRadius - caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                } else {
                    x2 = vm.caretX;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                }
                if (yAlign === 'top') {
                    y1 = ptY;
                    y2 = y1 - caretSize;
                    y3 = y1;
                } else {
                    y1 = ptY + height;
                    y2 = y1 + caretSize;
                    y3 = y1;
                    var tmp = x3;
                    x3 = x1;
                    x1 = tmp;
                }
            }
            return {
                x1: x1,
                x2: x2,
                x3: x3,
                y1: y1,
                y2: y2,
                y3: y3
            };
        },
        drawTitle: function (pt, vm, ctx) {
            var title = vm.title;
            if (title.length) {
                pt.x = getAlignedX(vm, vm._titleAlign);
                ctx.textAlign = vm._titleAlign;
                ctx.textBaseline = 'top';
                var titleFontSize = vm.titleFontSize;
                var titleSpacing = vm.titleSpacing;
                ctx.fillStyle = vm.titleFontColor;
                ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);
                var i, len;
                for (i = 0, len = title.length; i < len; ++i) {
                    ctx.fillText(title[i], pt.x, pt.y);
                    pt.y += titleFontSize + titleSpacing;
                    if (i + 1 === title.length) {
                        pt.y += vm.titleMarginBottom - titleSpacing;
                    }
                }
            }
        },
        drawBody: function (pt, vm, ctx) {
            var bodyFontSize = vm.bodyFontSize;
            var bodySpacing = vm.bodySpacing;
            var bodyAlign = vm._bodyAlign;
            var body = vm.body;
            var drawColorBoxes = vm.displayColors;
            var labelColors = vm.labelColors;
            var xLinePadding = 0;
            var colorX = drawColorBoxes ? getAlignedX(vm, 'left') : 0;
            var textColor;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = 'top';
            ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
            pt.x = getAlignedX(vm, bodyAlign);
            var fillLineOfText = function (line) {
                ctx.fillText(line, pt.x + xLinePadding, pt.y);
                pt.y += bodyFontSize + bodySpacing;
            };
            ctx.fillStyle = vm.bodyFontColor;
            helpers.each(vm.beforeBody, fillLineOfText);
            xLinePadding = drawColorBoxes && bodyAlign !== 'right' ? bodyAlign === 'center' ? bodyFontSize / 2 + 1 : bodyFontSize + 2 : 0;
            helpers.each(body, function (bodyItem, i) {
                textColor = vm.labelTextColors[i];
                ctx.fillStyle = textColor;
                helpers.each(bodyItem.before, fillLineOfText);
                helpers.each(bodyItem.lines, function (line) {
                    if (drawColorBoxes) {
                        ctx.fillStyle = vm.legendColorBackground;
                        ctx.fillRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = labelColors[i].borderColor;
                        ctx.strokeRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                        ctx.fillStyle = labelColors[i].backgroundColor;
                        ctx.fillRect(colorX + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
                        ctx.fillStyle = textColor;
                    }
                    fillLineOfText(line);
                });
                helpers.each(bodyItem.after, fillLineOfText);
            });
            xLinePadding = 0;
            helpers.each(vm.afterBody, fillLineOfText);
            pt.y -= bodySpacing;
        },
        drawFooter: function (pt, vm, ctx) {
            var footer = vm.footer;
            if (footer.length) {
                pt.x = getAlignedX(vm, vm._footerAlign);
                pt.y += vm.footerMarginTop;
                ctx.textAlign = vm._footerAlign;
                ctx.textBaseline = 'top';
                ctx.fillStyle = vm.footerFontColor;
                ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);
                helpers.each(footer, function (line) {
                    ctx.fillText(line, pt.x, pt.y);
                    pt.y += vm.footerFontSize + vm.footerSpacing;
                });
            }
        },
        drawBackground: function (pt, vm, ctx, tooltipSize) {
            ctx.fillStyle = vm.backgroundColor;
            ctx.strokeStyle = vm.borderColor;
            ctx.lineWidth = vm.borderWidth;
            var xAlign = vm.xAlign;
            var yAlign = vm.yAlign;
            var x = pt.x;
            var y = pt.y;
            var width = tooltipSize.width;
            var height = tooltipSize.height;
            var radius = vm.cornerRadius;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            if (yAlign === 'top') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            if (yAlign === 'center' && xAlign === 'right') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            if (yAlign === 'bottom') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            if (yAlign === 'center' && xAlign === 'left') {
                this.drawCaret(pt, tooltipSize);
            }
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            if (vm.borderWidth > 0) {
                ctx.stroke();
            }
        },
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            if (vm.opacity === 0) {
                return;
            }
            var tooltipSize = {
                width: vm.width,
                height: vm.height
            };
            var pt = {
                x: vm.x,
                y: vm.y
            };
            var opacity = Math.abs(vm.opacity < 0.001) ? 0 : vm.opacity;
            var hasTooltipContent = vm.title.length || vm.beforeBody.length || vm.body.length || vm.afterBody.length || vm.footer.length;
            if (this._options.enabled && hasTooltipContent) {
                ctx.save();
                ctx.globalAlpha = opacity;
                this.drawBackground(pt, vm, ctx, tooltipSize);
                pt.y += vm.yPadding;
                this.drawTitle(pt, vm, ctx);
                this.drawBody(pt, vm, ctx);
                this.drawFooter(pt, vm, ctx);
                ctx.restore();
            }
        },
        handleEvent: function (e) {
            var me = this;
            var options = me._options;
            var changed = false;
            me._lastActive = me._lastActive || [];
            if (e.type === 'mouseout') {
                me._active = [];
            } else {
                me._active = me._chart.getElementsAtEventForMode(e, options.mode, options);
            }
            changed = !helpers.arrayEquals(me._active, me._lastActive);
            if (changed) {
                me._lastActive = me._active;
                if (options.enabled || options.custom) {
                    me._eventPosition = {
                        x: e.x,
                        y: e.y
                    };
                    me.update(true);
                    me.pivot();
                }
            }
            return changed;
        }
    });
    exports.positioners = positioners;
    module.exports = exports;
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