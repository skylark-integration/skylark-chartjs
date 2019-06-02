define([
    '../helpers/index',
    './platform.dom.css'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var stylesheet = __module__1;
    var EXPANDO_KEY = '$chartjs';
    var CSS_PREFIX = 'chartjs-';
    var CSS_SIZE_MONITOR = CSS_PREFIX + 'size-monitor';
    var CSS_RENDER_MONITOR = CSS_PREFIX + 'render-monitor';
    var CSS_RENDER_ANIMATION = CSS_PREFIX + 'render-animation';
    var ANIMATION_START_EVENTS = [
        'animationstart',
        'webkitAnimationStart'
    ];
    var EVENT_TYPES = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup',
        pointerenter: 'mouseenter',
        pointerdown: 'mousedown',
        pointermove: 'mousemove',
        pointerup: 'mouseup',
        pointerleave: 'mouseout',
        pointerout: 'mouseout'
    };
    function readUsedSize(element, property) {
        var value = helpers.getStyle(element, property);
        var matches = value && value.match(/^(\d+)(\.\d+)?px$/);
        return matches ? Number(matches[1]) : undefined;
    }
    function initCanvas(canvas, config) {
        var style = canvas.style;
        var renderHeight = canvas.getAttribute('height');
        var renderWidth = canvas.getAttribute('width');
        canvas[EXPANDO_KEY] = {
            initial: {
                height: renderHeight,
                width: renderWidth,
                style: {
                    display: style.display,
                    height: style.height,
                    width: style.width
                }
            }
        };
        style.display = style.display || 'block';
        if (renderWidth === null || renderWidth === '') {
            var displayWidth = readUsedSize(canvas, 'width');
            if (displayWidth !== undefined) {
                canvas.width = displayWidth;
            }
        }
        if (renderHeight === null || renderHeight === '') {
            if (canvas.style.height === '') {
                canvas.height = canvas.width / (config.options.aspectRatio || 2);
            } else {
                var displayHeight = readUsedSize(canvas, 'height');
                if (displayWidth !== undefined) {
                    canvas.height = displayHeight;
                }
            }
        }
        return canvas;
    }
    var supportsEventListenerOptions = function () {
        var supports = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    supports = true;
                }
            });
            window.addEventListener('e', null, options);
        } catch (e) {
        }
        return supports;
    }();
    var eventListenerOptions = supportsEventListenerOptions ? { passive: true } : false;
    function addListener(node, type, listener) {
        node.addEventListener(type, listener, eventListenerOptions);
    }
    function removeListener(node, type, listener) {
        node.removeEventListener(type, listener, eventListenerOptions);
    }
    function createEvent(type, chart, x, y, nativeEvent) {
        return {
            type: type,
            chart: chart,
            native: nativeEvent || null,
            x: x !== undefined ? x : null,
            y: y !== undefined ? y : null
        };
    }
    function fromNativeEvent(event, chart) {
        var type = EVENT_TYPES[event.type] || event.type;
        var pos = helpers.getRelativePosition(event, chart);
        return createEvent(type, chart, pos.x, pos.y, event);
    }
    function throttled(fn, thisArg) {
        var ticking = false;
        var args = [];
        return function () {
            args = Array.prototype.slice.call(arguments);
            thisArg = thisArg || this;
            if (!ticking) {
                ticking = true;
                helpers.requestAnimFrame.call(window, function () {
                    ticking = false;
                    fn.apply(thisArg, args);
                });
            }
        };
    }
    function createDiv(cls) {
        var el = document.createElement('div');
        el.className = cls || '';
        return el;
    }
    function createResizer(handler) {
        var maxSize = 1000000;
        var resizer = createDiv(CSS_SIZE_MONITOR);
        var expand = createDiv(CSS_SIZE_MONITOR + '-expand');
        var shrink = createDiv(CSS_SIZE_MONITOR + '-shrink');
        expand.appendChild(createDiv());
        shrink.appendChild(createDiv());
        resizer.appendChild(expand);
        resizer.appendChild(shrink);
        resizer._reset = function () {
            expand.scrollLeft = maxSize;
            expand.scrollTop = maxSize;
            shrink.scrollLeft = maxSize;
            shrink.scrollTop = maxSize;
        };
        var onScroll = function () {
            resizer._reset();
            handler();
        };
        addListener(expand, 'scroll', onScroll.bind(expand, 'expand'));
        addListener(shrink, 'scroll', onScroll.bind(shrink, 'shrink'));
        return resizer;
    }
    function watchForRender(node, handler) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});
        var proxy = expando.renderProxy = function (e) {
            if (e.animationName === CSS_RENDER_ANIMATION) {
                handler();
            }
        };
        helpers.each(ANIMATION_START_EVENTS, function (type) {
            addListener(node, type, proxy);
        });
        expando.reflow = !!node.offsetParent;
        node.classList.add(CSS_RENDER_MONITOR);
    }
    function unwatchForRender(node) {
        var expando = node[EXPANDO_KEY] || {};
        var proxy = expando.renderProxy;
        if (proxy) {
            helpers.each(ANIMATION_START_EVENTS, function (type) {
                removeListener(node, type, proxy);
            });
            delete expando.renderProxy;
        }
        node.classList.remove(CSS_RENDER_MONITOR);
    }
    function addResizeListener(node, listener, chart) {
        var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});
        var resizer = expando.resizer = createResizer(throttled(function () {
            if (expando.resizer) {
                var container = chart.options.maintainAspectRatio && node.parentNode;
                var w = container ? container.clientWidth : 0;
                listener(createEvent('resize', chart));
                if (container && container.clientWidth < w && chart.canvas) {
                    listener(createEvent('resize', chart));
                }
            }
        }));
        watchForRender(node, function () {
            if (expando.resizer) {
                var container = node.parentNode;
                if (container && container !== resizer.parentNode) {
                    container.insertBefore(resizer, container.firstChild);
                }
                resizer._reset();
            }
        });
    }
    function removeResizeListener(node) {
        var expando = node[EXPANDO_KEY] || {};
        var resizer = expando.resizer;
        delete expando.resizer;
        unwatchForRender(node);
        if (resizer && resizer.parentNode) {
            resizer.parentNode.removeChild(resizer);
        }
    }
    function injectCSS(platform, css) {
        var style = platform._style || document.createElement('style');
        if (!platform._style) {
            platform._style = style;
            css = '/* Chart.js */\n' + css;
            style.setAttribute('type', 'text/css');
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        style.appendChild(document.createTextNode(css));
    }
    module.exports = {
        disableCSSInjection: false,
        _enabled: typeof window !== 'undefined' && typeof document !== 'undefined',
        _ensureLoaded: function () {
            if (this._loaded) {
                return;
            }
            this._loaded = true;
            if (!this.disableCSSInjection) {
                injectCSS(this, stylesheet);
            }
        },
        acquireContext: function (item, config) {
            if (typeof item === 'string') {
                item = document.getElementById(item);
            } else if (item.length) {
                item = item[0];
            }
            if (item && item.canvas) {
                item = item.canvas;
            }
            var context = item && item.getContext && item.getContext('2d');
            this._ensureLoaded();
            if (context && context.canvas === item) {
                initCanvas(item, config);
                return context;
            }
            return null;
        },
        releaseContext: function (context) {
            var canvas = context.canvas;
            if (!canvas[EXPANDO_KEY]) {
                return;
            }
            var initial = canvas[EXPANDO_KEY].initial;
            [
                'height',
                'width'
            ].forEach(function (prop) {
                var value = initial[prop];
                if (helpers.isNullOrUndef(value)) {
                    canvas.removeAttribute(prop);
                } else {
                    canvas.setAttribute(prop, value);
                }
            });
            helpers.each(initial.style || {}, function (value, key) {
                canvas.style[key] = value;
            });
            canvas.width = canvas.width;
            delete canvas[EXPANDO_KEY];
        },
        addEventListener: function (chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') {
                addResizeListener(canvas, listener, chart);
                return;
            }
            var expando = listener[EXPANDO_KEY] || (listener[EXPANDO_KEY] = {});
            var proxies = expando.proxies || (expando.proxies = {});
            var proxy = proxies[chart.id + '_' + type] = function (event) {
                listener(fromNativeEvent(event, chart));
            };
            addListener(canvas, type, proxy);
        },
        removeEventListener: function (chart, type, listener) {
            var canvas = chart.canvas;
            if (type === 'resize') {
                removeResizeListener(canvas);
                return;
            }
            var expando = listener[EXPANDO_KEY] || {};
            var proxies = expando.proxies || {};
            var proxy = proxies[chart.id + '_' + type];
            if (!proxy) {
                return;
            }
            removeListener(canvas, type, proxy);
        }
    };
    helpers.addEvent = addListener;
    helpers.removeEvent = removeListener;
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