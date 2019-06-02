define([
    './controller.line',
    '../core/core.defaults'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var LineController = __module__0;
    var defaults = __module__1;
    defaults._set('scatter', {
        hover: { mode: 'single' },
        scales: {
            xAxes: [{
                    id: 'x-axis-1',
                    type: 'linear',
                    position: 'bottom'
                }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left'
                }]
        },
        showLines: false,
        tooltips: {
            callbacks: {
                title: function () {
                    return '';
                },
                label: function (item) {
                    return '(' + item.xLabel + ', ' + item.yLabel + ')';
                }
            }
        }
    });
    module.exports = LineController;
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