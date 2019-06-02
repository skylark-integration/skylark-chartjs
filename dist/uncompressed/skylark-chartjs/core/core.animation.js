define(['./core.element'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Element = __module__0;
    var exports = Element.extend({
        chart: null,
        currentStep: 0,
        numSteps: 60,
        easing: '',
        render: null,
        onAnimationProgress: null,
        onAnimationComplete: null
    });
    module.exports = exports;
    Object.defineProperty(exports.prototype, 'animationObject', {
        get: function () {
            return this;
        }
    });
    Object.defineProperty(exports.prototype, 'chartInstance', {
        get: function () {
            return this.chart;
        },
        set: function (value) {
            this.chart = value;
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