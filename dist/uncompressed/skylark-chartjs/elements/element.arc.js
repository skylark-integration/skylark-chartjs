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
    defaults._set('global', {
        elements: {
            arc: {
                backgroundColor: defaults.global.defaultColor,
                borderColor: '#fff',
                borderWidth: 2,
                borderAlign: 'center'
            }
        }
    });
    module.exports = Element.extend({
        inLabelRange: function (mouseX) {
            var vm = this._view;
            if (vm) {
                return Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2);
            }
            return false;
        },
        inRange: function (chartX, chartY) {
            var vm = this._view;
            if (vm) {
                var pointRelativePosition = helpers.getAngleFromPoint(vm, {
                    x: chartX,
                    y: chartY
                });
                var angle = pointRelativePosition.angle;
                var distance = pointRelativePosition.distance;
                var startAngle = vm.startAngle;
                var endAngle = vm.endAngle;
                while (endAngle < startAngle) {
                    endAngle += 2 * Math.PI;
                }
                while (angle > endAngle) {
                    angle -= 2 * Math.PI;
                }
                while (angle < startAngle) {
                    angle += 2 * Math.PI;
                }
                var betweenAngles = angle >= startAngle && angle <= endAngle;
                var withinRadius = distance >= vm.innerRadius && distance <= vm.outerRadius;
                return betweenAngles && withinRadius;
            }
            return false;
        },
        getCenterPoint: function () {
            var vm = this._view;
            var halfAngle = (vm.startAngle + vm.endAngle) / 2;
            var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
            return {
                x: vm.x + Math.cos(halfAngle) * halfRadius,
                y: vm.y + Math.sin(halfAngle) * halfRadius
            };
        },
        getArea: function () {
            var vm = this._view;
            return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
        },
        tooltipPosition: function () {
            var vm = this._view;
            var centreAngle = vm.startAngle + (vm.endAngle - vm.startAngle) / 2;
            var rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;
            return {
                x: vm.x + Math.cos(centreAngle) * rangeFromCentre,
                y: vm.y + Math.sin(centreAngle) * rangeFromCentre
            };
        },
        draw: function () {
            var ctx = this._chart.ctx;
            var vm = this._view;
            var sA = vm.startAngle;
            var eA = vm.endAngle;
            var pixelMargin = vm.borderAlign === 'inner' ? 0.33 : 0;
            var angleMargin;
            ctx.save();
            ctx.beginPath();
            ctx.arc(vm.x, vm.y, Math.max(vm.outerRadius - pixelMargin, 0), sA, eA);
            ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
            ctx.closePath();
            ctx.fillStyle = vm.backgroundColor;
            ctx.fill();
            if (vm.borderWidth) {
                if (vm.borderAlign === 'inner') {
                    ctx.beginPath();
                    angleMargin = pixelMargin / vm.outerRadius;
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA - angleMargin, eA + angleMargin);
                    if (vm.innerRadius > pixelMargin) {
                        angleMargin = pixelMargin / vm.innerRadius;
                        ctx.arc(vm.x, vm.y, vm.innerRadius - pixelMargin, eA + angleMargin, sA - angleMargin, true);
                    } else {
                        ctx.arc(vm.x, vm.y, pixelMargin, eA + Math.PI / 2, sA - Math.PI / 2);
                    }
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
                    ctx.closePath();
                    ctx.lineWidth = vm.borderWidth * 2;
                    ctx.lineJoin = 'round';
                } else {
                    ctx.lineWidth = vm.borderWidth;
                    ctx.lineJoin = 'bevel';
                }
                ctx.strokeStyle = vm.borderColor;
                ctx.stroke();
            }
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