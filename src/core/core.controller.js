define([
    './core.animation',
    './core.animations',
    '../controllers/index',
    './core.defaults',
    '../helpers/index',
    './core.interaction',
    './core.layouts',
    '../platforms/platform',
    './core.plugins',
    '../core/core.scaleService',
    './core.tooltip'
], function (__module__0, __module__1, __module__2, __module__3, __module__4, __module__5, __module__6, __module__7, __module__8, __module__9, __module__10) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var Animation = __module__0;
    var animations = __module__1;
    var controllers = __module__2;
    var defaults = __module__3;
    var helpers = __module__4;
    var Interaction = __module__5;
    var layouts = __module__6;
    var platform = __module__7;
    var plugins = __module__8;
    var scaleService = __module__9;
    var Tooltip = __module__10;
    var valueOrDefault = helpers.valueOrDefault;
    defaults._set('global', {
        elements: {},
        events: [
            'mousemove',
            'mouseout',
            'click',
            'touchstart',
            'touchmove'
        ],
        hover: {
            onHover: null,
            mode: 'nearest',
            intersect: true,
            animationDuration: 400
        },
        onClick: null,
        maintainAspectRatio: true,
        responsive: true,
        responsiveAnimationDuration: 0
    });
    function mergeScaleConfig() {
        return helpers.merge({}, [].slice.call(arguments), {
            merger: function (key, target, source, options) {
                if (key === 'xAxes' || key === 'yAxes') {
                    var slen = source[key].length;
                    var i, type, scale;
                    if (!target[key]) {
                        target[key] = [];
                    }
                    for (i = 0; i < slen; ++i) {
                        scale = source[key][i];
                        type = valueOrDefault(scale.type, key === 'xAxes' ? 'category' : 'linear');
                        if (i >= target[key].length) {
                            target[key].push({});
                        }
                        if (!target[key][i].type || scale.type && scale.type !== target[key][i].type) {
                            helpers.merge(target[key][i], [
                                scaleService.getScaleDefaults(type),
                                scale
                            ]);
                        } else {
                            helpers.merge(target[key][i], scale);
                        }
                    }
                } else {
                    helpers._merger(key, target, source, options);
                }
            }
        });
    }
    function mergeConfig() {
        return helpers.merge({}, [].slice.call(arguments), {
            merger: function (key, target, source, options) {
                var tval = target[key] || {};
                var sval = source[key];
                if (key === 'scales') {
                    target[key] = mergeScaleConfig(tval, sval);
                } else if (key === 'scale') {
                    target[key] = helpers.merge(tval, [
                        scaleService.getScaleDefaults(sval.type),
                        sval
                    ]);
                } else {
                    helpers._merger(key, target, source, options);
                }
            }
        });
    }
    function initConfig(config) {
        config = config || {};
        var data = config.data = config.data || {};
        data.datasets = data.datasets || [];
        data.labels = data.labels || [];
        config.options = mergeConfig(defaults.global, defaults[config.type], config.options || {});
        return config;
    }
    function updateConfig(chart) {
        var newOptions = chart.options;
        helpers.each(chart.scales, function (scale) {
            layouts.removeBox(chart, scale);
        });
        newOptions = mergeConfig(defaults.global, defaults[chart.config.type], newOptions);
        chart.options = chart.config.options = newOptions;
        chart.ensureScalesHaveIDs();
        chart.buildOrUpdateScales();
        chart.tooltip._options = newOptions.tooltips;
        chart.tooltip.initialize();
    }
    function positionIsHorizontal(position) {
        return position === 'top' || position === 'bottom';
    }
    var Chart = function (item, config) {
        this.construct(item, config);
        return this;
    };
    helpers.extend(Chart.prototype, {
        construct: function (item, config) {
            var me = this;
            config = initConfig(config);
            var context = platform.acquireContext(item, config);
            var canvas = context && context.canvas;
            var height = canvas && canvas.height;
            var width = canvas && canvas.width;
            me.id = helpers.uid();
            me.ctx = context;
            me.canvas = canvas;
            me.config = config;
            me.width = width;
            me.height = height;
            me.aspectRatio = height ? width / height : null;
            me.options = config.options;
            me._bufferedRender = false;
            me.chart = me;
            me.controller = me;
            Chart.instances[me.id] = me;
            Object.defineProperty(me, 'data', {
                get: function () {
                    return me.config.data;
                },
                set: function (value) {
                    me.config.data = value;
                }
            });
            if (!context || !canvas) {
                console.error("Failed to create chart: can't acquire context from the given item");
                return;
            }
            me.initialize();
            me.update();
        },
        initialize: function () {
            var me = this;
            plugins.notify(me, 'beforeInit');
            helpers.retinaScale(me, me.options.devicePixelRatio);
            me.bindEvents();
            if (me.options.responsive) {
                me.resize(true);
            }
            me.ensureScalesHaveIDs();
            me.buildOrUpdateScales();
            me.initToolTip();
            plugins.notify(me, 'afterInit');
            return me;
        },
        clear: function () {
            helpers.canvas.clear(this);
            return this;
        },
        stop: function () {
            animations.cancelAnimation(this);
            return this;
        },
        resize: function (silent) {
            var me = this;
            var options = me.options;
            var canvas = me.canvas;
            var aspectRatio = options.maintainAspectRatio && me.aspectRatio || null;
            var newWidth = Math.max(0, Math.floor(helpers.getMaximumWidth(canvas)));
            var newHeight = Math.max(0, Math.floor(aspectRatio ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas)));
            if (me.width === newWidth && me.height === newHeight) {
                return;
            }
            canvas.width = me.width = newWidth;
            canvas.height = me.height = newHeight;
            canvas.style.width = newWidth + 'px';
            canvas.style.height = newHeight + 'px';
            helpers.retinaScale(me, options.devicePixelRatio);
            if (!silent) {
                var newSize = {
                    width: newWidth,
                    height: newHeight
                };
                plugins.notify(me, 'resize', [newSize]);
                if (options.onResize) {
                    options.onResize(me, newSize);
                }
                me.stop();
                me.update({ duration: options.responsiveAnimationDuration });
            }
        },
        ensureScalesHaveIDs: function () {
            var options = this.options;
            var scalesOptions = options.scales || {};
            var scaleOptions = options.scale;
            helpers.each(scalesOptions.xAxes, function (xAxisOptions, index) {
                xAxisOptions.id = xAxisOptions.id || 'x-axis-' + index;
            });
            helpers.each(scalesOptions.yAxes, function (yAxisOptions, index) {
                yAxisOptions.id = yAxisOptions.id || 'y-axis-' + index;
            });
            if (scaleOptions) {
                scaleOptions.id = scaleOptions.id || 'scale';
            }
        },
        buildOrUpdateScales: function () {
            var me = this;
            var options = me.options;
            var scales = me.scales || {};
            var items = [];
            var updated = Object.keys(scales).reduce(function (obj, id) {
                obj[id] = false;
                return obj;
            }, {});
            if (options.scales) {
                items = items.concat((options.scales.xAxes || []).map(function (xAxisOptions) {
                    return {
                        options: xAxisOptions,
                        dtype: 'category',
                        dposition: 'bottom'
                    };
                }), (options.scales.yAxes || []).map(function (yAxisOptions) {
                    return {
                        options: yAxisOptions,
                        dtype: 'linear',
                        dposition: 'left'
                    };
                }));
            }
            if (options.scale) {
                items.push({
                    options: options.scale,
                    dtype: 'radialLinear',
                    isDefault: true,
                    dposition: 'chartArea'
                });
            }
            helpers.each(items, function (item) {
                var scaleOptions = item.options;
                var id = scaleOptions.id;
                var scaleType = valueOrDefault(scaleOptions.type, item.dtype);
                if (positionIsHorizontal(scaleOptions.position) !== positionIsHorizontal(item.dposition)) {
                    scaleOptions.position = item.dposition;
                }
                updated[id] = true;
                var scale = null;
                if (id in scales && scales[id].type === scaleType) {
                    scale = scales[id];
                    scale.options = scaleOptions;
                    scale.ctx = me.ctx;
                    scale.chart = me;
                } else {
                    var scaleClass = scaleService.getScaleConstructor(scaleType);
                    if (!scaleClass) {
                        return;
                    }
                    scale = new scaleClass({
                        id: id,
                        type: scaleType,
                        options: scaleOptions,
                        ctx: me.ctx,
                        chart: me
                    });
                    scales[scale.id] = scale;
                }
                scale.mergeTicksOptions();
                if (item.isDefault) {
                    me.scale = scale;
                }
            });
            helpers.each(updated, function (hasUpdated, id) {
                if (!hasUpdated) {
                    delete scales[id];
                }
            });
            me.scales = scales;
            scaleService.addScalesToLayout(this);
        },
        buildOrUpdateControllers: function () {
            var me = this;
            var newControllers = [];
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                var meta = me.getDatasetMeta(datasetIndex);
                var type = dataset.type || me.config.type;
                if (meta.type && meta.type !== type) {
                    me.destroyDatasetMeta(datasetIndex);
                    meta = me.getDatasetMeta(datasetIndex);
                }
                meta.type = type;
                if (meta.controller) {
                    meta.controller.updateIndex(datasetIndex);
                    meta.controller.linkScales();
                } else {
                    var ControllerClass = controllers[meta.type];
                    if (ControllerClass === undefined) {
                        throw new Error('"' + meta.type + '" is not a chart type.');
                    }
                    meta.controller = new ControllerClass(me, datasetIndex);
                    newControllers.push(meta.controller);
                }
            }, me);
            return newControllers;
        },
        resetElements: function () {
            var me = this;
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                me.getDatasetMeta(datasetIndex).controller.reset();
            }, me);
        },
        reset: function () {
            this.resetElements();
            this.tooltip.initialize();
        },
        update: function (config) {
            var me = this;
            if (!config || typeof config !== 'object') {
                config = {
                    duration: config,
                    lazy: arguments[1]
                };
            }
            updateConfig(me);
            plugins._invalidate(me);
            if (plugins.notify(me, 'beforeUpdate') === false) {
                return;
            }
            me.tooltip._data = me.data;
            var newControllers = me.buildOrUpdateControllers();
            helpers.each(me.data.datasets, function (dataset, datasetIndex) {
                me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
            }, me);
            me.updateLayout();
            if (me.options.animation && me.options.animation.duration) {
                helpers.each(newControllers, function (controller) {
                    controller.reset();
                });
            }
            me.updateDatasets();
            me.tooltip.initialize();
            me.lastActive = [];
            plugins.notify(me, 'afterUpdate');
            if (me._bufferedRender) {
                me._bufferedRequest = {
                    duration: config.duration,
                    easing: config.easing,
                    lazy: config.lazy
                };
            } else {
                me.render(config);
            }
        },
        updateLayout: function () {
            var me = this;
            if (plugins.notify(me, 'beforeLayout') === false) {
                return;
            }
            layouts.update(this, this.width, this.height);
            plugins.notify(me, 'afterScaleUpdate');
            plugins.notify(me, 'afterLayout');
        },
        updateDatasets: function () {
            var me = this;
            if (plugins.notify(me, 'beforeDatasetsUpdate') === false) {
                return;
            }
            for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
                me.updateDataset(i);
            }
            plugins.notify(me, 'afterDatasetsUpdate');
        },
        updateDataset: function (index) {
            var me = this;
            var meta = me.getDatasetMeta(index);
            var args = {
                meta: meta,
                index: index
            };
            if (plugins.notify(me, 'beforeDatasetUpdate', [args]) === false) {
                return;
            }
            meta.controller.update();
            plugins.notify(me, 'afterDatasetUpdate', [args]);
        },
        render: function (config) {
            var me = this;
            if (!config || typeof config !== 'object') {
                config = {
                    duration: config,
                    lazy: arguments[1]
                };
            }
            var animationOptions = me.options.animation;
            var duration = valueOrDefault(config.duration, animationOptions && animationOptions.duration);
            var lazy = config.lazy;
            if (plugins.notify(me, 'beforeRender') === false) {
                return;
            }
            var onComplete = function (animation) {
                plugins.notify(me, 'afterRender');
                helpers.callback(animationOptions && animationOptions.onComplete, [animation], me);
            };
            if (animationOptions && duration) {
                var animation = new Animation({
                    numSteps: duration / 16.66,
                    easing: config.easing || animationOptions.easing,
                    render: function (chart, animationObject) {
                        var easingFunction = helpers.easing.effects[animationObject.easing];
                        var currentStep = animationObject.currentStep;
                        var stepDecimal = currentStep / animationObject.numSteps;
                        chart.draw(easingFunction(stepDecimal), stepDecimal, currentStep);
                    },
                    onAnimationProgress: animationOptions.onProgress,
                    onAnimationComplete: onComplete
                });
                animations.addAnimation(me, animation, duration, lazy);
            } else {
                me.draw();
                onComplete(new Animation({
                    numSteps: 0,
                    chart: me
                }));
            }
            return me;
        },
        draw: function (easingValue) {
            var me = this;
            me.clear();
            if (helpers.isNullOrUndef(easingValue)) {
                easingValue = 1;
            }
            me.transition(easingValue);
            if (me.width <= 0 || me.height <= 0) {
                return;
            }
            if (plugins.notify(me, 'beforeDraw', [easingValue]) === false) {
                return;
            }
            helpers.each(me.boxes, function (box) {
                box.draw(me.chartArea);
            }, me);
            me.drawDatasets(easingValue);
            me._drawTooltip(easingValue);
            plugins.notify(me, 'afterDraw', [easingValue]);
        },
        transition: function (easingValue) {
            var me = this;
            for (var i = 0, ilen = (me.data.datasets || []).length; i < ilen; ++i) {
                if (me.isDatasetVisible(i)) {
                    me.getDatasetMeta(i).controller.transition(easingValue);
                }
            }
            me.tooltip.transition(easingValue);
        },
        drawDatasets: function (easingValue) {
            var me = this;
            if (plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) {
                return;
            }
            for (var i = (me.data.datasets || []).length - 1; i >= 0; --i) {
                if (me.isDatasetVisible(i)) {
                    me.drawDataset(i, easingValue);
                }
            }
            plugins.notify(me, 'afterDatasetsDraw', [easingValue]);
        },
        drawDataset: function (index, easingValue) {
            var me = this;
            var meta = me.getDatasetMeta(index);
            var args = {
                meta: meta,
                index: index,
                easingValue: easingValue
            };
            if (plugins.notify(me, 'beforeDatasetDraw', [args]) === false) {
                return;
            }
            meta.controller.draw(easingValue);
            plugins.notify(me, 'afterDatasetDraw', [args]);
        },
        _drawTooltip: function (easingValue) {
            var me = this;
            var tooltip = me.tooltip;
            var args = {
                tooltip: tooltip,
                easingValue: easingValue
            };
            if (plugins.notify(me, 'beforeTooltipDraw', [args]) === false) {
                return;
            }
            tooltip.draw();
            plugins.notify(me, 'afterTooltipDraw', [args]);
        },
        getElementAtEvent: function (e) {
            return Interaction.modes.single(this, e);
        },
        getElementsAtEvent: function (e) {
            return Interaction.modes.label(this, e, { intersect: true });
        },
        getElementsAtXAxis: function (e) {
            return Interaction.modes['x-axis'](this, e, { intersect: true });
        },
        getElementsAtEventForMode: function (e, mode, options) {
            var method = Interaction.modes[mode];
            if (typeof method === 'function') {
                return method(this, e, options);
            }
            return [];
        },
        getDatasetAtEvent: function (e) {
            return Interaction.modes.dataset(this, e, { intersect: true });
        },
        getDatasetMeta: function (datasetIndex) {
            var me = this;
            var dataset = me.data.datasets[datasetIndex];
            if (!dataset._meta) {
                dataset._meta = {};
            }
            var meta = dataset._meta[me.id];
            if (!meta) {
                meta = dataset._meta[me.id] = {
                    type: null,
                    data: [],
                    dataset: null,
                    controller: null,
                    hidden: null,
                    xAxisID: null,
                    yAxisID: null
                };
            }
            return meta;
        },
        getVisibleDatasetCount: function () {
            var count = 0;
            for (var i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
                if (this.isDatasetVisible(i)) {
                    count++;
                }
            }
            return count;
        },
        isDatasetVisible: function (datasetIndex) {
            var meta = this.getDatasetMeta(datasetIndex);
            return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
        },
        generateLegend: function () {
            return this.options.legendCallback(this);
        },
        destroyDatasetMeta: function (datasetIndex) {
            var id = this.id;
            var dataset = this.data.datasets[datasetIndex];
            var meta = dataset._meta && dataset._meta[id];
            if (meta) {
                meta.controller.destroy();
                delete dataset._meta[id];
            }
        },
        destroy: function () {
            var me = this;
            var canvas = me.canvas;
            var i, ilen;
            me.stop();
            for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
                me.destroyDatasetMeta(i);
            }
            if (canvas) {
                me.unbindEvents();
                helpers.canvas.clear(me);
                platform.releaseContext(me.ctx);
                me.canvas = null;
                me.ctx = null;
            }
            plugins.notify(me, 'destroy');
            delete Chart.instances[me.id];
        },
        toBase64Image: function () {
            return this.canvas.toDataURL.apply(this.canvas, arguments);
        },
        initToolTip: function () {
            var me = this;
            me.tooltip = new Tooltip({
                _chart: me,
                _chartInstance: me,
                _data: me.data,
                _options: me.options.tooltips
            }, me);
        },
        bindEvents: function () {
            var me = this;
            var listeners = me._listeners = {};
            var listener = function () {
                me.eventHandler.apply(me, arguments);
            };
            helpers.each(me.options.events, function (type) {
                platform.addEventListener(me, type, listener);
                listeners[type] = listener;
            });
            if (me.options.responsive) {
                listener = function () {
                    me.resize();
                };
                platform.addEventListener(me, 'resize', listener);
                listeners.resize = listener;
            }
        },
        unbindEvents: function () {
            var me = this;
            var listeners = me._listeners;
            if (!listeners) {
                return;
            }
            delete me._listeners;
            helpers.each(listeners, function (listener, type) {
                platform.removeEventListener(me, type, listener);
            });
        },
        updateHoverStyle: function (elements, mode, enabled) {
            var method = enabled ? 'setHoverStyle' : 'removeHoverStyle';
            var element, i, ilen;
            for (i = 0, ilen = elements.length; i < ilen; ++i) {
                element = elements[i];
                if (element) {
                    this.getDatasetMeta(element._datasetIndex).controller[method](element);
                }
            }
        },
        eventHandler: function (e) {
            var me = this;
            var tooltip = me.tooltip;
            if (plugins.notify(me, 'beforeEvent', [e]) === false) {
                return;
            }
            me._bufferedRender = true;
            me._bufferedRequest = null;
            var changed = me.handleEvent(e);
            if (tooltip) {
                changed = tooltip._start ? tooltip.handleEvent(e) : changed | tooltip.handleEvent(e);
            }
            plugins.notify(me, 'afterEvent', [e]);
            var bufferedRequest = me._bufferedRequest;
            if (bufferedRequest) {
                me.render(bufferedRequest);
            } else if (changed && !me.animating) {
                me.stop();
                me.render({
                    duration: me.options.hover.animationDuration,
                    lazy: true
                });
            }
            me._bufferedRender = false;
            me._bufferedRequest = null;
            return me;
        },
        handleEvent: function (e) {
            var me = this;
            var options = me.options || {};
            var hoverOptions = options.hover;
            var changed = false;
            me.lastActive = me.lastActive || [];
            if (e.type === 'mouseout') {
                me.active = [];
            } else {
                me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions);
            }
            helpers.callback(options.onHover || options.hover.onHover, [
                e.native,
                me.active
            ], me);
            if (e.type === 'mouseup' || e.type === 'click') {
                if (options.onClick) {
                    options.onClick.call(me, e.native, me.active);
                }
            }
            if (me.lastActive.length) {
                me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
            }
            if (me.active.length && hoverOptions.mode) {
                me.updateHoverStyle(me.active, hoverOptions.mode, true);
            }
            changed = !helpers.arrayEquals(me.active, me.lastActive);
            me.lastActive = me.active;
            return changed;
        }
    });
    Chart.instances = {};
    module.exports = Chart;
    Chart.Controller = Chart;
    Chart.types = {};
    helpers.configMerge = mergeConfig;
    helpers.scaleMerge = mergeScaleConfig;
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