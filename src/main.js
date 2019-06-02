define([
    './core/core.controller',
    './helpers/index',
    './core/core.helpers',
    './core/core.adapters',
    './core/core.animation',
    './core/core.animations',
    './controllers/index',
    './core/core.datasetController',
    './core/core.defaults',
    './core/core.element',
    './elements/index',
    './core/core.interaction',
    './core/core.layouts',
    './platforms/platform',
    './core/core.plugins',
    './core/core.scale',
    './core/core.scaleService',
    './core/core.ticks',
    './core/core.tooltip',
    './scales/index',
    './adapters/index',
    './plugins/index',
    './scales/scale.linearbase'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8, __module__9, __module__10, __module__11, __module__12, __module__13, __module__14, __module__15, __module__16, __module__17, __module__18, __module__19, __module__20, __module__21, __module__22) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Chart = __module__0;
    Chart.helpers = __module__1;
    __module__2(Chart);
    Chart._adapters = __module__3;
    Chart.Animation = __module__4;
    Chart.animationService = __module__5;
    Chart.controllers = __module__6;
    Chart.DatasetController = __module__7;
    Chart.defaults = __module__8;
    Chart.Element = __module__9;
    Chart.elements = __module__10;
    Chart.Interaction = __module__11;
    Chart.layouts = __module__12;
    Chart.platform = __module__13;
    Chart.plugins = __module__14;
    Chart.Scale = __module__15;
    Chart.scaleService = __module__16;
    Chart.Ticks = __module__17;
    Chart.Tooltip = __module__18;
    var scales = __module__19;
    Chart.helpers.each(scales, function (scale, type) {
        Chart.scaleService.registerScaleType(type, scale, scale._defaults);
    });
    __module__20;
    var plugins = __module__21;
    for (var k in plugins) {
        if (plugins.hasOwnProperty(k)) {
            Chart.plugins.register(plugins[k]);
        }
    }
    Chart.platform.initialize();
    module.exports = Chart;
    if (typeof window !== 'undefined') {
        window.Chart = Chart;
    }
    Chart.Chart = Chart;
    Chart.Legend = plugins.legend._element;
    Chart.Title = plugins.title._element;
    Chart.pluginService = Chart.plugins;
    Chart.PluginBase = Chart.Element.extend({});
    Chart.canvasHelpers = Chart.helpers.canvas;
    Chart.layoutService = Chart.layouts;
    Chart.LinearScaleBase = __module__22;
    Chart.helpers.each([
        'Bar',
        'Bubble',
        'Doughnut',
        'Line',
        'PolarArea',
        'Radar',
        'Scatter'
    ], function (klass) {
        Chart[klass] = function (ctx, cfg) {
            return new Chart(ctx, Chart.helpers.merge(cfg || {}, { type: klass.charAt(0).toLowerCase() + klass.slice(1) }));
        };
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