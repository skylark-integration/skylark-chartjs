define([], function () {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = {
        noop: function () {
        },
        uid: function () {
            var id = 0;
            return function () {
                return id++;
            };
        }(),
        isNullOrUndef: function (value) {
            return value === null || typeof value === 'undefined';
        },
        isArray: function (value) {
            if (Array.isArray && Array.isArray(value)) {
                return true;
            }
            var type = Object.prototype.toString.call(value);
            if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
                return true;
            }
            return false;
        },
        isObject: function (value) {
            return value !== null && Object.prototype.toString.call(value) === '[object Object]';
        },
        isFinite: function (value) {
            return (typeof value === 'number' || value instanceof Number) && isFinite(value);
        },
        valueOrDefault: function (value, defaultValue) {
            return typeof value === 'undefined' ? defaultValue : value;
        },
        valueAtIndexOrDefault: function (value, index, defaultValue) {
            return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue);
        },
        callback: function (fn, args, thisArg) {
            if (fn && typeof fn.call === 'function') {
                return fn.apply(thisArg, args);
            }
        },
        each: function (loopable, fn, thisArg, reverse) {
            var i, len, keys;
            if (helpers.isArray(loopable)) {
                len = loopable.length;
                if (reverse) {
                    for (i = len - 1; i >= 0; i--) {
                        fn.call(thisArg, loopable[i], i);
                    }
                } else {
                    for (i = 0; i < len; i++) {
                        fn.call(thisArg, loopable[i], i);
                    }
                }
            } else if (helpers.isObject(loopable)) {
                keys = Object.keys(loopable);
                len = keys.length;
                for (i = 0; i < len; i++) {
                    fn.call(thisArg, loopable[keys[i]], keys[i]);
                }
            }
        },
        arrayEquals: function (a0, a1) {
            var i, ilen, v0, v1;
            if (!a0 || !a1 || a0.length !== a1.length) {
                return false;
            }
            for (i = 0, ilen = a0.length; i < ilen; ++i) {
                v0 = a0[i];
                v1 = a1[i];
                if (v0 instanceof Array && v1 instanceof Array) {
                    if (!helpers.arrayEquals(v0, v1)) {
                        return false;
                    }
                } else if (v0 !== v1) {
                    return false;
                }
            }
            return true;
        },
        clone: function (source) {
            if (helpers.isArray(source)) {
                return source.map(helpers.clone);
            }
            if (helpers.isObject(source)) {
                var target = {};
                var keys = Object.keys(source);
                var klen = keys.length;
                var k = 0;
                for (; k < klen; ++k) {
                    target[keys[k]] = helpers.clone(source[keys[k]]);
                }
                return target;
            }
            return source;
        },
        _merger: function (key, target, source, options) {
            var tval = target[key];
            var sval = source[key];
            if (helpers.isObject(tval) && helpers.isObject(sval)) {
                helpers.merge(tval, sval, options);
            } else {
                target[key] = helpers.clone(sval);
            }
        },
        _mergerIf: function (key, target, source) {
            var tval = target[key];
            var sval = source[key];
            if (helpers.isObject(tval) && helpers.isObject(sval)) {
                helpers.mergeIf(tval, sval);
            } else if (!target.hasOwnProperty(key)) {
                target[key] = helpers.clone(sval);
            }
        },
        merge: function (target, source, options) {
            var sources = helpers.isArray(source) ? source : [source];
            var ilen = sources.length;
            var merge, i, keys, klen, k;
            if (!helpers.isObject(target)) {
                return target;
            }
            options = options || {};
            merge = options.merger || helpers._merger;
            for (i = 0; i < ilen; ++i) {
                source = sources[i];
                if (!helpers.isObject(source)) {
                    continue;
                }
                keys = Object.keys(source);
                for (k = 0, klen = keys.length; k < klen; ++k) {
                    merge(keys[k], target, source, options);
                }
            }
            return target;
        },
        mergeIf: function (target, source) {
            return helpers.merge(target, source, { merger: helpers._mergerIf });
        },
        extend: function (target) {
            var setFn = function (value, key) {
                target[key] = value;
            };
            for (var i = 1, ilen = arguments.length; i < ilen; ++i) {
                helpers.each(arguments[i], setFn);
            }
            return target;
        },
        inherits: function (extensions) {
            var me = this;
            var ChartElement = extensions && extensions.hasOwnProperty('constructor') ? extensions.constructor : function () {
                return me.apply(this, arguments);
            };
            var Surrogate = function () {
                this.constructor = ChartElement;
            };
            Surrogate.prototype = me.prototype;
            ChartElement.prototype = new Surrogate();
            ChartElement.extend = helpers.inherits;
            if (extensions) {
                helpers.extend(ChartElement.prototype, extensions);
            }
            ChartElement.__super__ = me.prototype;
            return ChartElement;
        }
    };
    module.exports = helpers;
    helpers.callCallback = helpers.callback;
    helpers.indexOf = function (array, item, fromIndex) {
        return Array.prototype.indexOf.call(array, item, fromIndex);
    };
    helpers.getValueOrDefault = helpers.valueOrDefault;
    helpers.getValueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
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