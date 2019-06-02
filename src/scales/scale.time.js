define([
    '../core/core.adapters',
    '../core/core.defaults',
    '../helpers/index',
    '../core/core.scale'
], function (__module__0, __module__1, __module__2, __module__3) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var adapters = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    var Scale = __module__3;
    var valueOrDefault = helpers.valueOrDefault;
    var MIN_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
    var MAX_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var INTERVALS = {
        millisecond: {
            common: true,
            size: 1,
            steps: [
                1,
                2,
                5,
                10,
                20,
                50,
                100,
                250,
                500
            ]
        },
        second: {
            common: true,
            size: 1000,
            steps: [
                1,
                2,
                5,
                10,
                15,
                30
            ]
        },
        minute: {
            common: true,
            size: 60000,
            steps: [
                1,
                2,
                5,
                10,
                15,
                30
            ]
        },
        hour: {
            common: true,
            size: 3600000,
            steps: [
                1,
                2,
                3,
                6,
                12
            ]
        },
        day: {
            common: true,
            size: 86400000,
            steps: [
                1,
                2,
                5
            ]
        },
        week: {
            common: false,
            size: 604800000,
            steps: [
                1,
                2,
                3,
                4
            ]
        },
        month: {
            common: true,
            size: 2628000000,
            steps: [
                1,
                2,
                3
            ]
        },
        quarter: {
            common: false,
            size: 7884000000,
            steps: [
                1,
                2,
                3,
                4
            ]
        },
        year: {
            common: true,
            size: 31540000000
        }
    };
    var UNITS = Object.keys(INTERVALS);
    function sorter(a, b) {
        return a - b;
    }
    function arrayUnique(items) {
        var hash = {};
        var out = [];
        var i, ilen, item;
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            item = items[i];
            if (!hash[item]) {
                hash[item] = true;
                out.push(item);
            }
        }
        return out;
    }
    function buildLookupTable(timestamps, min, max, distribution) {
        if (distribution === 'linear' || !timestamps.length) {
            return [
                {
                    time: min,
                    pos: 0
                },
                {
                    time: max,
                    pos: 1
                }
            ];
        }
        var table = [];
        var items = [min];
        var i, ilen, prev, curr, next;
        for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
            curr = timestamps[i];
            if (curr > min && curr < max) {
                items.push(curr);
            }
        }
        items.push(max);
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (prev === undefined || next === undefined || Math.round((next + prev) / 2) !== curr) {
                table.push({
                    time: curr,
                    pos: i / (ilen - 1)
                });
            }
        }
        return table;
    }
    function lookup(table, key, value) {
        var lo = 0;
        var hi = table.length - 1;
        var mid, i0, i1;
        while (lo >= 0 && lo <= hi) {
            mid = lo + hi >> 1;
            i0 = table[mid - 1] || null;
            i1 = table[mid];
            if (!i0) {
                return {
                    lo: null,
                    hi: i1
                };
            } else if (i1[key] < value) {
                lo = mid + 1;
            } else if (i0[key] > value) {
                hi = mid - 1;
            } else {
                return {
                    lo: i0,
                    hi: i1
                };
            }
        }
        return {
            lo: i1,
            hi: null
        };
    }
    function interpolate(table, skey, sval, tkey) {
        var range = lookup(table, skey, sval);
        var prev = !range.lo ? table[0] : !range.hi ? table[table.length - 2] : range.lo;
        var next = !range.lo ? table[1] : !range.hi ? table[table.length - 1] : range.hi;
        var span = next[skey] - prev[skey];
        var ratio = span ? (sval - prev[skey]) / span : 0;
        var offset = (next[tkey] - prev[tkey]) * ratio;
        return prev[tkey] + offset;
    }
    function toTimestamp(scale, input) {
        var adapter = scale._adapter;
        var options = scale.options.time;
        var parser = options.parser;
        var format = parser || options.format;
        var value = input;
        if (typeof parser === 'function') {
            value = parser(value);
        }
        if (!helpers.isFinite(value)) {
            value = typeof format === 'string' ? adapter.parse(value, format) : adapter.parse(value);
        }
        if (value !== null) {
            return +value;
        }
        if (!parser && typeof format === 'function') {
            value = format(input);
            if (!helpers.isFinite(value)) {
                value = adapter.parse(value);
            }
        }
        return value;
    }
    function parse(scale, input) {
        if (helpers.isNullOrUndef(input)) {
            return null;
        }
        var options = scale.options.time;
        var value = toTimestamp(scale, scale.getRightValue(input));
        if (value === null) {
            return value;
        }
        if (options.round) {
            value = +scale._adapter.startOf(value, options.round);
        }
        return value;
    }
    function determineStepSize(min, max, unit, capacity) {
        var range = max - min;
        var interval = INTERVALS[unit];
        var milliseconds = interval.size;
        var steps = interval.steps;
        var i, ilen, factor;
        if (!steps) {
            return Math.ceil(range / (capacity * milliseconds));
        }
        for (i = 0, ilen = steps.length; i < ilen; ++i) {
            factor = steps[i];
            if (Math.ceil(range / (milliseconds * factor)) <= capacity) {
                break;
            }
        }
        return factor;
    }
    function determineUnitForAutoTicks(minUnit, min, max, capacity) {
        var ilen = UNITS.length;
        var i, interval, factor;
        for (i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
            interval = INTERVALS[UNITS[i]];
            factor = interval.steps ? interval.steps[interval.steps.length - 1] : MAX_INTEGER;
            if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
                return UNITS[i];
            }
        }
        return UNITS[ilen - 1];
    }
    function determineUnitForFormatting(scale, ticks, minUnit, min, max) {
        var ilen = UNITS.length;
        var i, unit;
        for (i = ilen - 1; i >= UNITS.indexOf(minUnit); i--) {
            unit = UNITS[i];
            if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= ticks.length) {
                return unit;
            }
        }
        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
    }
    function determineMajorUnit(unit) {
        for (var i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
            if (INTERVALS[UNITS[i]].common) {
                return UNITS[i];
            }
        }
    }
    function generate(scale, min, max, capacity) {
        var adapter = scale._adapter;
        var options = scale.options;
        var timeOpts = options.time;
        var minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, capacity);
        var major = determineMajorUnit(minor);
        var stepSize = valueOrDefault(timeOpts.stepSize, timeOpts.unitStepSize);
        var weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        var majorTicksEnabled = options.ticks.major.enabled;
        var interval = INTERVALS[minor];
        var first = min;
        var last = max;
        var ticks = [];
        var time;
        if (!stepSize) {
            stepSize = determineStepSize(min, max, minor, capacity);
        }
        if (weekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
            last = +adapter.startOf(last, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, weekday ? 'day' : minor);
        last = +adapter.startOf(last, weekday ? 'day' : minor);
        if (last < max) {
            last = +adapter.add(last, 1, minor);
        }
        time = first;
        if (majorTicksEnabled && major && !weekday && !timeOpts.round) {
            time = +adapter.startOf(time, major);
            time = +adapter.add(time, ~~((first - time) / (interval.size * stepSize)) * stepSize, minor);
        }
        for (; time < last; time = +adapter.add(time, stepSize, minor)) {
            ticks.push(+time);
        }
        ticks.push(+time);
        return ticks;
    }
    function computeOffsets(table, ticks, min, max, options) {
        var start = 0;
        var end = 0;
        var first, last;
        if (options.offset && ticks.length) {
            if (!options.time.min) {
                first = interpolate(table, 'time', ticks[0], 'pos');
                if (ticks.length === 1) {
                    start = 1 - first;
                } else {
                    start = (interpolate(table, 'time', ticks[1], 'pos') - first) / 2;
                }
            }
            if (!options.time.max) {
                last = interpolate(table, 'time', ticks[ticks.length - 1], 'pos');
                if (ticks.length === 1) {
                    end = last;
                } else {
                    end = (last - interpolate(table, 'time', ticks[ticks.length - 2], 'pos')) / 2;
                }
            }
        }
        return {
            start: start,
            end: end
        };
    }
    function ticksFromTimestamps(scale, values, majorUnit) {
        var ticks = [];
        var i, ilen, value, major;
        for (i = 0, ilen = values.length; i < ilen; ++i) {
            value = values[i];
            major = majorUnit ? value === +scale._adapter.startOf(value, majorUnit) : false;
            ticks.push({
                value: value,
                major: major
            });
        }
        return ticks;
    }
    var defaultConfig = {
        position: 'bottom',
        distribution: 'linear',
        bounds: 'data',
        adapters: {},
        time: {
            parser: false,
            format: false,
            unit: false,
            round: false,
            displayFormat: false,
            isoWeekday: false,
            minUnit: 'millisecond',
            displayFormats: {}
        },
        ticks: {
            autoSkip: false,
            source: 'auto',
            major: { enabled: false }
        }
    };
    module.exports = Scale.extend({
        initialize: function () {
            this.mergeTicksOptions();
            Scale.prototype.initialize.call(this);
        },
        update: function () {
            var me = this;
            var options = me.options;
            var time = options.time || (options.time = {});
            var adapter = me._adapter = new adapters._date(options.adapters.date);
            if (time.format) {
                console.warn('options.time.format is deprecated and replaced by options.time.parser.');
            }
            helpers.mergeIf(time.displayFormats, adapter.formats());
            return Scale.prototype.update.apply(me, arguments);
        },
        getRightValue: function (rawValue) {
            if (rawValue && rawValue.t !== undefined) {
                rawValue = rawValue.t;
            }
            return Scale.prototype.getRightValue.call(this, rawValue);
        },
        determineDataLimits: function () {
            var me = this;
            var chart = me.chart;
            var adapter = me._adapter;
            var timeOpts = me.options.time;
            var unit = timeOpts.unit || 'day';
            var min = MAX_INTEGER;
            var max = MIN_INTEGER;
            var timestamps = [];
            var datasets = [];
            var labels = [];
            var i, j, ilen, jlen, data, timestamp;
            var dataLabels = chart.data.labels || [];
            for (i = 0, ilen = dataLabels.length; i < ilen; ++i) {
                labels.push(parse(me, dataLabels[i]));
            }
            for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
                if (chart.isDatasetVisible(i)) {
                    data = chart.data.datasets[i].data;
                    if (helpers.isObject(data[0])) {
                        datasets[i] = [];
                        for (j = 0, jlen = data.length; j < jlen; ++j) {
                            timestamp = parse(me, data[j]);
                            timestamps.push(timestamp);
                            datasets[i][j] = timestamp;
                        }
                    } else {
                        for (j = 0, jlen = labels.length; j < jlen; ++j) {
                            timestamps.push(labels[j]);
                        }
                        datasets[i] = labels.slice(0);
                    }
                } else {
                    datasets[i] = [];
                }
            }
            if (labels.length) {
                labels = arrayUnique(labels).sort(sorter);
                min = Math.min(min, labels[0]);
                max = Math.max(max, labels[labels.length - 1]);
            }
            if (timestamps.length) {
                timestamps = arrayUnique(timestamps).sort(sorter);
                min = Math.min(min, timestamps[0]);
                max = Math.max(max, timestamps[timestamps.length - 1]);
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            min = min === MAX_INTEGER ? +adapter.startOf(Date.now(), unit) : min;
            max = max === MIN_INTEGER ? +adapter.endOf(Date.now(), unit) + 1 : max;
            me.min = Math.min(min, max);
            me.max = Math.max(min + 1, max);
            me._horizontal = me.isHorizontal();
            me._table = [];
            me._timestamps = {
                data: timestamps,
                datasets: datasets,
                labels: labels
            };
        },
        buildTicks: function () {
            var me = this;
            var min = me.min;
            var max = me.max;
            var options = me.options;
            var timeOpts = options.time;
            var timestamps = [];
            var ticks = [];
            var i, ilen, timestamp;
            switch (options.ticks.source) {
            case 'data':
                timestamps = me._timestamps.data;
                break;
            case 'labels':
                timestamps = me._timestamps.labels;
                break;
            case 'auto':
            default:
                timestamps = generate(me, min, max, me.getLabelCapacity(min), options);
            }
            if (options.bounds === 'ticks' && timestamps.length) {
                min = timestamps[0];
                max = timestamps[timestamps.length - 1];
            }
            min = parse(me, timeOpts.min) || min;
            max = parse(me, timeOpts.max) || max;
            for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
                timestamp = timestamps[i];
                if (timestamp >= min && timestamp <= max) {
                    ticks.push(timestamp);
                }
            }
            me.min = min;
            me.max = max;
            me._unit = timeOpts.unit || determineUnitForFormatting(me, ticks, timeOpts.minUnit, me.min, me.max);
            me._majorUnit = determineMajorUnit(me._unit);
            me._table = buildLookupTable(me._timestamps.data, min, max, options.distribution);
            me._offsets = computeOffsets(me._table, ticks, min, max, options);
            if (options.ticks.reverse) {
                ticks.reverse();
            }
            return ticksFromTimestamps(me, ticks, me._majorUnit);
        },
        getLabelForIndex: function (index, datasetIndex) {
            var me = this;
            var adapter = me._adapter;
            var data = me.chart.data;
            var timeOpts = me.options.time;
            var label = data.labels && index < data.labels.length ? data.labels[index] : '';
            var value = data.datasets[datasetIndex].data[index];
            if (helpers.isObject(value)) {
                label = me.getRightValue(value);
            }
            if (timeOpts.tooltipFormat) {
                return adapter.format(toTimestamp(me, label), timeOpts.tooltipFormat);
            }
            if (typeof label === 'string') {
                return label;
            }
            return adapter.format(toTimestamp(me, label), timeOpts.displayFormats.datetime);
        },
        tickFormatFunction: function (time, index, ticks, format) {
            var me = this;
            var adapter = me._adapter;
            var options = me.options;
            var formats = options.time.displayFormats;
            var minorFormat = formats[me._unit];
            var majorUnit = me._majorUnit;
            var majorFormat = formats[majorUnit];
            var majorTime = +adapter.startOf(time, majorUnit);
            var majorTickOpts = options.ticks.major;
            var major = majorTickOpts.enabled && majorUnit && majorFormat && time === majorTime;
            var label = adapter.format(time, format ? format : major ? majorFormat : minorFormat);
            var tickOpts = major ? majorTickOpts : options.ticks.minor;
            var formatter = valueOrDefault(tickOpts.callback, tickOpts.userCallback);
            return formatter ? formatter(label, index, ticks) : label;
        },
        convertTicksToLabels: function (ticks) {
            var labels = [];
            var i, ilen;
            for (i = 0, ilen = ticks.length; i < ilen; ++i) {
                labels.push(this.tickFormatFunction(ticks[i].value, i, ticks));
            }
            return labels;
        },
        getPixelForOffset: function (time) {
            var me = this;
            var isReverse = me.options.ticks.reverse;
            var size = me._horizontal ? me.width : me.height;
            var start = me._horizontal ? isReverse ? me.right : me.left : isReverse ? me.bottom : me.top;
            var pos = interpolate(me._table, 'time', time, 'pos');
            var offset = size * (me._offsets.start + pos) / (me._offsets.start + 1 + me._offsets.end);
            return isReverse ? start - offset : start + offset;
        },
        getPixelForValue: function (value, index, datasetIndex) {
            var me = this;
            var time = null;
            if (index !== undefined && datasetIndex !== undefined) {
                time = me._timestamps.datasets[datasetIndex][index];
            }
            if (time === null) {
                time = parse(me, value);
            }
            if (time !== null) {
                return me.getPixelForOffset(time);
            }
        },
        getPixelForTick: function (index) {
            var ticks = this.getTicks();
            return index >= 0 && index < ticks.length ? this.getPixelForOffset(ticks[index].value) : null;
        },
        getValueForPixel: function (pixel) {
            var me = this;
            var size = me._horizontal ? me.width : me.height;
            var start = me._horizontal ? me.left : me.top;
            var pos = (size ? (pixel - start) / size : 0) * (me._offsets.start + 1 + me._offsets.start) - me._offsets.end;
            var time = interpolate(me._table, 'pos', pos, 'time');
            return me._adapter._create(time);
        },
        getLabelWidth: function (label) {
            var me = this;
            var ticksOpts = me.options.ticks;
            var tickLabelWidth = me.ctx.measureText(label).width;
            var angle = helpers.toRadians(ticksOpts.maxRotation);
            var cosRotation = Math.cos(angle);
            var sinRotation = Math.sin(angle);
            var tickFontSize = valueOrDefault(ticksOpts.fontSize, defaults.global.defaultFontSize);
            return tickLabelWidth * cosRotation + tickFontSize * sinRotation;
        },
        getLabelCapacity: function (exampleTime) {
            var me = this;
            var format = me.options.time.displayFormats.millisecond;
            var exampleLabel = me.tickFormatFunction(exampleTime, 0, [], format);
            var tickLabelWidth = me.getLabelWidth(exampleLabel);
            var innerWidth = me.isHorizontal() ? me.width : me.height;
            var capacity = Math.floor(innerWidth / tickLabelWidth);
            return capacity > 0 ? capacity : 1;
        }
    });
    module.exports._defaults = defaultConfig;
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