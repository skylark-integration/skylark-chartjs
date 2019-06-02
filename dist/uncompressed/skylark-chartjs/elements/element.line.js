define([
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var valueOrDefault = helpers.valueOrDefault;
    var defaultColor = defaults.global.defaultColor;
    defaults._set('global', {
        elements: {
            line: {
                tension: 0.4,
                backgroundColor: defaultColor,
                borderWidth: 3,
                borderColor: defaultColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0,
                borderJoinStyle: 'miter',
                capBezierPoints: true,
                fill: true
            }
        }
    });
    module.exports = Element.extend({
        draw: function () {
            var me = this;
            var vm = me._view;
            var ctx = me._chart.ctx;
            var spanGaps = vm.spanGaps;
            var points = me._children.slice();
            var globalDefaults = defaults.global;
            var globalOptionLineElements = globalDefaults.elements.line;
            var lastDrawnIndex = -1;
            var index, current, previous, currentVM;
            if (me._loop && points.length) {
                points.push(points[0]);
            }
            ctx.save();
            ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;
            if (ctx.setLineDash) {
                ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
            }
            ctx.lineDashOffset = valueOrDefault(vm.borderDashOffset, globalOptionLineElements.borderDashOffset);
            ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
            ctx.lineWidth = valueOrDefault(vm.borderWidth, globalOptionLineElements.borderWidth);
            ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;
            ctx.beginPath();
            lastDrawnIndex = -1;
            for (index = 0; index < points.length; ++index) {
                current = points[index];
                previous = helpers.previousItem(points, index);
                currentVM = current._view;
                if (index === 0) {
                    if (!currentVM.skip) {
                        ctx.moveTo(currentVM.x, currentVM.y);
                        lastDrawnIndex = index;
                    }
                } else {
                    previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];
                    if (!currentVM.skip) {
                        if (lastDrawnIndex !== index - 1 && !spanGaps || lastDrawnIndex === -1) {
                            ctx.moveTo(currentVM.x, currentVM.y);
                        } else {
                            helpers.canvas.lineTo(ctx, previous._view, current._view);
                        }
                        lastDrawnIndex = index;
                    }
                }
            }
            ctx.stroke();
            ctx.restore();
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