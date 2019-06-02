define(['../helpers/index'], function (__module__0) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var helpers = __module__0;
    var resolve = helpers.options.resolve;
    var arrayEvents = [
        'push',
        'pop',
        'shift',
        'splice',
        'unshift'
    ];
    function listenArrayEvents(array, listener) {
        if (array._chartjs) {
            array._chartjs.listeners.push(listener);
            return;
        }
        Object.defineProperty(array, '_chartjs', {
            configurable: true,
            enumerable: false,
            value: { listeners: [listener] }
        });
        arrayEvents.forEach(function (key) {
            var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
            var base = array[key];
            Object.defineProperty(array, key, {
                configurable: true,
                enumerable: false,
                value: function () {
                    var args = Array.prototype.slice.call(arguments);
                    var res = base.apply(this, args);
                    helpers.each(array._chartjs.listeners, function (object) {
                        if (typeof object[method] === 'function') {
                            object[method].apply(object, args);
                        }
                    });
                    return res;
                }
            });
        });
    }
    function unlistenArrayEvents(array, listener) {
        var stub = array._chartjs;
        if (!stub) {
            return;
        }
        var listeners = stub.listeners;
        var index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        if (listeners.length > 0) {
            return;
        }
        arrayEvents.forEach(function (key) {
            delete array[key];
        });
        delete array._chartjs;
    }
    var DatasetController = function (chart, datasetIndex) {
        this.initialize(chart, datasetIndex);
    };
    helpers.extend(DatasetController.prototype, {
        datasetElementType: null,
        dataElementType: null,
        initialize: function (chart, datasetIndex) {
            var me = this;
            me.chart = chart;
            me.index = datasetIndex;
            me.linkScales();
            me.addElements();
        },
        updateIndex: function (datasetIndex) {
            this.index = datasetIndex;
        },
        linkScales: function () {
            var me = this;
            var meta = me.getMeta();
            var dataset = me.getDataset();
            if (meta.xAxisID === null || !(meta.xAxisID in me.chart.scales)) {
                meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
            }
            if (meta.yAxisID === null || !(meta.yAxisID in me.chart.scales)) {
                meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
            }
        },
        getDataset: function () {
            return this.chart.data.datasets[this.index];
        },
        getMeta: function () {
            return this.chart.getDatasetMeta(this.index);
        },
        getScaleForId: function (scaleID) {
            return this.chart.scales[scaleID];
        },
        _getValueScaleId: function () {
            return this.getMeta().yAxisID;
        },
        _getIndexScaleId: function () {
            return this.getMeta().xAxisID;
        },
        _getValueScale: function () {
            return this.getScaleForId(this._getValueScaleId());
        },
        _getIndexScale: function () {
            return this.getScaleForId(this._getIndexScaleId());
        },
        reset: function () {
            this.update(true);
        },
        destroy: function () {
            if (this._data) {
                unlistenArrayEvents(this._data, this);
            }
        },
        createMetaDataset: function () {
            var me = this;
            var type = me.datasetElementType;
            return type && new type({
                _chart: me.chart,
                _datasetIndex: me.index
            });
        },
        createMetaData: function (index) {
            var me = this;
            var type = me.dataElementType;
            return type && new type({
                _chart: me.chart,
                _datasetIndex: me.index,
                _index: index
            });
        },
        addElements: function () {
            var me = this;
            var meta = me.getMeta();
            var data = me.getDataset().data || [];
            var metaData = meta.data;
            var i, ilen;
            for (i = 0, ilen = data.length; i < ilen; ++i) {
                metaData[i] = metaData[i] || me.createMetaData(i);
            }
            meta.dataset = meta.dataset || me.createMetaDataset();
        },
        addElementAndReset: function (index) {
            var element = this.createMetaData(index);
            this.getMeta().data.splice(index, 0, element);
            this.updateElement(element, index, true);
        },
        buildOrUpdateElements: function () {
            var me = this;
            var dataset = me.getDataset();
            var data = dataset.data || (dataset.data = []);
            if (me._data !== data) {
                if (me._data) {
                    unlistenArrayEvents(me._data, me);
                }
                if (data && Object.isExtensible(data)) {
                    listenArrayEvents(data, me);
                }
                me._data = data;
            }
            me.resyncElements();
        },
        update: helpers.noop,
        transition: function (easingValue) {
            var meta = this.getMeta();
            var elements = meta.data || [];
            var ilen = elements.length;
            var i = 0;
            for (; i < ilen; ++i) {
                elements[i].transition(easingValue);
            }
            if (meta.dataset) {
                meta.dataset.transition(easingValue);
            }
        },
        draw: function () {
            var meta = this.getMeta();
            var elements = meta.data || [];
            var ilen = elements.length;
            var i = 0;
            if (meta.dataset) {
                meta.dataset.draw();
            }
            for (; i < ilen; ++i) {
                elements[i].draw();
            }
        },
        removeHoverStyle: function (element) {
            helpers.merge(element._model, element.$previousStyle || {});
            delete element.$previousStyle;
        },
        setHoverStyle: function (element) {
            var dataset = this.chart.data.datasets[element._datasetIndex];
            var index = element._index;
            var custom = element.custom || {};
            var model = element._model;
            var getHoverColor = helpers.getHoverColor;
            element.$previousStyle = {
                backgroundColor: model.backgroundColor,
                borderColor: model.borderColor,
                borderWidth: model.borderWidth
            };
            model.backgroundColor = resolve([
                custom.hoverBackgroundColor,
                dataset.hoverBackgroundColor,
                getHoverColor(model.backgroundColor)
            ], undefined, index);
            model.borderColor = resolve([
                custom.hoverBorderColor,
                dataset.hoverBorderColor,
                getHoverColor(model.borderColor)
            ], undefined, index);
            model.borderWidth = resolve([
                custom.hoverBorderWidth,
                dataset.hoverBorderWidth,
                model.borderWidth
            ], undefined, index);
        },
        resyncElements: function () {
            var me = this;
            var meta = me.getMeta();
            var data = me.getDataset().data;
            var numMeta = meta.data.length;
            var numData = data.length;
            if (numData < numMeta) {
                meta.data.splice(numData, numMeta - numData);
            } else if (numData > numMeta) {
                me.insertElements(numMeta, numData - numMeta);
            }
        },
        insertElements: function (start, count) {
            for (var i = 0; i < count; ++i) {
                this.addElementAndReset(start + i);
            }
        },
        onDataPush: function () {
            var count = arguments.length;
            this.insertElements(this.getDataset().data.length - count, count);
        },
        onDataPop: function () {
            this.getMeta().data.pop();
        },
        onDataShift: function () {
            this.getMeta().data.shift();
        },
        onDataSplice: function (start, count) {
            this.getMeta().data.splice(start, count);
            this.insertElements(start, arguments.length - 2);
        },
        onDataUnshift: function () {
            this.insertElements(0, arguments.length);
        }
    });
    DatasetController.extend = helpers.inherits;
    module.exports = DatasetController;
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