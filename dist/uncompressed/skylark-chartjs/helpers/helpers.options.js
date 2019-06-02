define([
    '../core/core.defaults',
    './helpers.core'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    var valueOrDefault = helpers.valueOrDefault;
    function toFontString(font) {
        if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
            return null;
        }
        return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
    }
    module.exports = {
        toLineHeight: function (value, size) {
            var matches = ('' + value).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
            if (!matches || matches[1] === 'normal') {
                return size * 1.2;
            }
            value = +matches[2];
            switch (matches[3]) {
            case 'px':
                return value;
            case '%':
                value /= 100;
                break;
            default:
                break;
            }
            return size * value;
        },
        toPadding: function (value) {
            var t, r, b, l;
            if (helpers.isObject(value)) {
                t = +value.top || 0;
                r = +value.right || 0;
                b = +value.bottom || 0;
                l = +value.left || 0;
            } else {
                t = r = b = l = +value || 0;
            }
            return {
                top: t,
                right: r,
                bottom: b,
                left: l,
                height: t + b,
                width: l + r
            };
        },
        _parseFont: function (options) {
            var globalDefaults = defaults.global;
            var size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
            var font = {
                family: valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily),
                lineHeight: helpers.options.toLineHeight(valueOrDefault(options.lineHeight, globalDefaults.defaultLineHeight), size),
                size: size,
                style: valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle),
                weight: null,
                string: ''
            };
            font.string = toFontString(font);
            return font;
        },
        resolve: function (inputs, context, index) {
            var i, ilen, value;
            for (i = 0, ilen = inputs.length; i < ilen; ++i) {
                value = inputs[i];
                if (value === undefined) {
                    continue;
                }
                if (context !== undefined && typeof value === 'function') {
                    value = value(context);
                }
                if (index !== undefined && helpers.isArray(value)) {
                    value = value[index];
                }
                if (value !== undefined) {
                    return value;
                }
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