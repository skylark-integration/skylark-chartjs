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
            point: {
                radius: 3,
                pointStyle: 'circle',
                backgroundColor: defaultColor,
                borderColor: defaultColor,
                borderWidth: 1,
                hitRadius: 1,
                hoverRadius: 4,
                hoverBorderWidth: 1
            }
        }
    });
    function xRange(mouseX) {
        var vm = this._view;
        return vm ? Math.abs(mouseX - vm.x) < vm.radius + vm.hitRadius : false;
    }
    function yRange(mouseY) {
        var vm = this._view;
        return vm ? Math.abs(mouseY - vm.y) < vm.radius + vm.hitRadius : false;
    }
    module.exports = Element.extend({
        inRange: function (mouseX, mouseY) {
            var vm = this._view;
            return vm ? Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2) < Math.pow(vm.hitRadius + vm.radius, 2) : false;
        },
        inLabelRange: xRange,
        inXRange: xRange,
        inYRange: yRange,
        getCenterPoint: function () {
            var vm = this._view;
            return {
                x: vm.x,
                y: vm.y
            };
        },
        getArea: function () {
            return Math.PI * Math.pow(this._view.radius, 2);
        },
        tooltipPosition: function () {
            var vm = this._view;
            return {
                x: vm.x,
                y: vm.y,
                padding: vm.radius + vm.borderWidth
            };
        },
        draw: function (chartArea) {
            var vm = this._view;
            var ctx = this._chart.ctx;
            var pointStyle = vm.pointStyle;
            var rotation = vm.rotation;
            var radius = vm.radius;
            var x = vm.x;
            var y = vm.y;
            var globalDefaults = defaults.global;
            var defaultColor = globalDefaults.defaultColor;
            if (vm.skip) {
                return;
            }
            if (chartArea === undefined || helpers.canvas._isPointInArea(vm, chartArea)) {
                ctx.strokeStyle = vm.borderColor || defaultColor;
                ctx.lineWidth = valueOrDefault(vm.borderWidth, globalDefaults.elements.point.borderWidth);
                ctx.fillStyle = vm.backgroundColor || defaultColor;
                helpers.canvas.drawPoint(ctx, pointStyle, radius, x, y, rotation);
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