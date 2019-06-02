define([
    '../core/core.defaults',
    '../core/core.element',
    '../helpers/index',
    '../core/core.layouts'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var Element = __module__1;
    var helpers = __module__2;
    var layouts = __module__3;
    var noop = helpers.noop;
    defaults._set('global', {
        title: {
            display: false,
            fontStyle: 'bold',
            fullWidth: true,
            padding: 10,
            position: 'top',
            text: '',
            weight: 2000
        }
    });
    var Title = Element.extend({
        initialize: function (config) {
            var me = this;
            helpers.extend(me, config);
            me.legendHitBoxes = [];
        },
        beforeUpdate: noop,
        update: function (maxWidth, maxHeight, margins) {
            var me = this;
            me.beforeUpdate();
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
            me.margins = margins;
            me.beforeSetDimensions();
            me.setDimensions();
            me.afterSetDimensions();
            me.beforeBuildLabels();
            me.buildLabels();
            me.afterBuildLabels();
            me.beforeFit();
            me.fit();
            me.afterFit();
            me.afterUpdate();
            return me.minSize;
        },
        afterUpdate: noop,
        beforeSetDimensions: noop,
        setDimensions: function () {
            var me = this;
            if (me.isHorizontal()) {
                me.width = me.maxWidth;
                me.left = 0;
                me.right = me.width;
            } else {
                me.height = me.maxHeight;
                me.top = 0;
                me.bottom = me.height;
            }
            me.paddingLeft = 0;
            me.paddingTop = 0;
            me.paddingRight = 0;
            me.paddingBottom = 0;
            me.minSize = {
                width: 0,
                height: 0
            };
        },
        afterSetDimensions: noop,
        beforeBuildLabels: noop,
        buildLabels: noop,
        afterBuildLabels: noop,
        beforeFit: noop,
        fit: function () {
            var me = this;
            var opts = me.options;
            var display = opts.display;
            var minSize = me.minSize;
            var lineCount = helpers.isArray(opts.text) ? opts.text.length : 1;
            var fontOpts = helpers.options._parseFont(opts);
            var textSize = display ? lineCount * fontOpts.lineHeight + opts.padding * 2 : 0;
            if (me.isHorizontal()) {
                minSize.width = me.maxWidth;
                minSize.height = textSize;
            } else {
                minSize.width = textSize;
                minSize.height = me.maxHeight;
            }
            me.width = minSize.width;
            me.height = minSize.height;
        },
        afterFit: noop,
        isHorizontal: function () {
            var pos = this.options.position;
            return pos === 'top' || pos === 'bottom';
        },
        draw: function () {
            var me = this;
            var ctx = me.ctx;
            var opts = me.options;
            if (opts.display) {
                var fontOpts = helpers.options._parseFont(opts);
                var lineHeight = fontOpts.lineHeight;
                var offset = lineHeight / 2 + opts.padding;
                var rotation = 0;
                var top = me.top;
                var left = me.left;
                var bottom = me.bottom;
                var right = me.right;
                var maxWidth, titleX, titleY;
                ctx.fillStyle = helpers.valueOrDefault(opts.fontColor, defaults.global.defaultFontColor);
                ctx.font = fontOpts.string;
                if (me.isHorizontal()) {
                    titleX = left + (right - left) / 2;
                    titleY = top + offset;
                    maxWidth = right - left;
                } else {
                    titleX = opts.position === 'left' ? left + offset : right - offset;
                    titleY = top + (bottom - top) / 2;
                    maxWidth = bottom - top;
                    rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
                }
                ctx.save();
                ctx.translate(titleX, titleY);
                ctx.rotate(rotation);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var text = opts.text;
                if (helpers.isArray(text)) {
                    var y = 0;
                    for (var i = 0; i < text.length; ++i) {
                        ctx.fillText(text[i], 0, y, maxWidth);
                        y += lineHeight;
                    }
                } else {
                    ctx.fillText(text, 0, 0, maxWidth);
                }
                ctx.restore();
            }
        }
    });
    function createNewTitleBlockAndAttach(chart, titleOpts) {
        var title = new Title({
            ctx: chart.ctx,
            options: titleOpts,
            chart: chart
        });
        layouts.configure(chart, title, titleOpts);
        layouts.addBox(chart, title);
        chart.titleBlock = title;
    }
    module.exports = {
        id: 'title',
        _element: Title,
        beforeInit: function (chart) {
            var titleOpts = chart.options.title;
            if (titleOpts) {
                createNewTitleBlockAndAttach(chart, titleOpts);
            }
        },
        beforeUpdate: function (chart) {
            var titleOpts = chart.options.title;
            var titleBlock = chart.titleBlock;
            if (titleOpts) {
                helpers.mergeIf(titleOpts, defaults.global.title);
                if (titleBlock) {
                    layouts.configure(chart, titleBlock, titleOpts);
                    titleBlock.options = titleOpts;
                } else {
                    createNewTitleBlockAndAttach(chart, titleOpts);
                }
            } else if (titleBlock) {
                layouts.removeBox(chart, titleBlock);
                delete chart.titleBlock;
            }
        }
    };
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