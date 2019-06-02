define([
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    defaults._set('global', { plugins: {} });
    module.exports = {
        _plugins: [],
        _cacheId: 0,
        register: function (plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
                if (p.indexOf(plugin) === -1) {
                    p.push(plugin);
                }
            });
            this._cacheId++;
        },
        unregister: function (plugins) {
            var p = this._plugins;
            [].concat(plugins).forEach(function (plugin) {
                var idx = p.indexOf(plugin);
                if (idx !== -1) {
                    p.splice(idx, 1);
                }
            });
            this._cacheId++;
        },
        clear: function () {
            this._plugins = [];
            this._cacheId++;
        },
        count: function () {
            return this._plugins.length;
        },
        getAll: function () {
            return this._plugins;
        },
        notify: function (chart, hook, args) {
            var descriptors = this.descriptors(chart);
            var ilen = descriptors.length;
            var i, descriptor, plugin, params, method;
            for (i = 0; i < ilen; ++i) {
                descriptor = descriptors[i];
                plugin = descriptor.plugin;
                method = plugin[hook];
                if (typeof method === 'function') {
                    params = [chart].concat(args || []);
                    params.push(descriptor.options);
                    if (method.apply(plugin, params) === false) {
                        return false;
                    }
                }
            }
            return true;
        },
        descriptors: function (chart) {
            var cache = chart.$plugins || (chart.$plugins = {});
            if (cache.id === this._cacheId) {
                return cache.descriptors;
            }
            var plugins = [];
            var descriptors = [];
            var config = chart && chart.config || {};
            var options = config.options && config.options.plugins || {};
            this._plugins.concat(config.plugins || []).forEach(function (plugin) {
                var idx = plugins.indexOf(plugin);
                if (idx !== -1) {
                    return;
                }
                var id = plugin.id;
                var opts = options[id];
                if (opts === false) {
                    return;
                }
                if (opts === true) {
                    opts = helpers.clone(defaults.global.plugins[id]);
                }
                plugins.push(plugin);
                descriptors.push({
                    plugin: plugin,
                    options: opts || {}
                });
            });
            cache.descriptors = descriptors;
            cache.id = this._cacheId;
            return descriptors;
        },
        _invalidate: function (chart) {
            delete chart.$plugins;
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