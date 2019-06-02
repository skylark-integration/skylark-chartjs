define([
    './controller.bar',
    '../core/core.defaults'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var BarController = __module__0;
    var defaults = __module__1;
    defaults._set('horizontalBar', {
        hover: {
            mode: 'index',
            axis: 'y'
        },
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
            yAxes: [{
                    type: 'category',
                    position: 'left',
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                    offset: true,
                    gridLines: { offsetGridLines: true }
                }]
        },
        elements: { rectangle: { borderSkipped: 'left' } },
        tooltips: {
            mode: 'index',
            axis: 'y'
        }
    });
    module.exports = BarController.extend({
        _getValueScaleId: function () {
            return this.getMeta().xAxisID;
        },
        _getIndexScaleId: function () {
            return this.getMeta().yAxisID;
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