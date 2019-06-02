define([
//    'moment',
    '../core/core.adapters'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var moment = __module__0;
    var adapters = __module__1;
    var FORMATS = {
        datetime: 'MMM D, YYYY, h:mm:ss a',
        millisecond: 'h:mm:ss.SSS a',
        second: 'h:mm:ss a',
        minute: 'h:mm a',
        hour: 'hA',
        day: 'MMM D',
        week: 'll',
        month: 'MMM YYYY',
        quarter: '[Q]Q - YYYY',
        year: 'YYYY'
    };
    adapters._date.override(typeof moment === 'function' ? {
        _id: 'moment',
        formats: function () {
            return FORMATS;
        },
        parse: function (value, format) {
            if (typeof value === 'string' && typeof format === 'string') {
                value = moment(value, format);
            } else if (!(value instanceof moment)) {
                value = moment(value);
            }
            return value.isValid() ? value.valueOf() : null;
        },
        format: function (time, format) {
            return moment(time).format(format);
        },
        add: function (time, amount, unit) {
            return moment(time).add(amount, unit).valueOf();
        },
        diff: function (max, min, unit) {
            return moment.duration(moment(max).diff(moment(min))).as(unit);
        },
        startOf: function (time, unit, weekday) {
            time = moment(time);
            if (unit === 'isoWeek') {
                return time.isoWeekday(weekday).valueOf();
            }
            return time.startOf(unit).valueOf();
        },
        endOf: function (time, unit) {
            return moment(time).endOf(unit).valueOf();
        },
        _create: function (time) {
            return moment(time);
        }
    } : {});
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