define([
    '../colors/Color',
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1, __module__2) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var color = __module__0;
    var defaults = __module__1;
    var helpers = __module__2;
    module.exports = function () {
        helpers.where = function (collection, filterCallback) {
            if (helpers.isArray(collection) && Array.prototype.filter) {
                return collection.filter(filterCallback);
            }
            var filtered = [];
            helpers.each(collection, function (item) {
                if (filterCallback(item)) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
        helpers.findIndex = Array.prototype.findIndex ? function (array, callback, scope) {
            return array.findIndex(callback, scope);
        } : function (array, callback, scope) {
            scope = scope === undefined ? array : scope;
            for (var i = 0, ilen = array.length; i < ilen; ++i) {
                if (callback.call(scope, array[i], i, array)) {
                    return i;
                }
            }
            return -1;
        };
        helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
            if (helpers.isNullOrUndef(startIndex)) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        };
        helpers.findPreviousWhere = function (arrayToSearch, filterCallback, startIndex) {
            if (helpers.isNullOrUndef(startIndex)) {
                startIndex = arrayToSearch.length;
            }
            for (var i = startIndex - 1; i >= 0; i--) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        };
        helpers.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        helpers.almostEquals = function (x, y, epsilon) {
            return Math.abs(x - y) < epsilon;
        };
        helpers.almostWhole = function (x, epsilon) {
            var rounded = Math.round(x);
            return rounded - epsilon < x && rounded + epsilon > x;
        };
        helpers.max = function (array) {
            return array.reduce(function (max, value) {
                if (!isNaN(value)) {
                    return Math.max(max, value);
                }
                return max;
            }, Number.NEGATIVE_INFINITY);
        };
        helpers.min = function (array) {
            return array.reduce(function (min, value) {
                if (!isNaN(value)) {
                    return Math.min(min, value);
                }
                return min;
            }, Number.POSITIVE_INFINITY);
        };
        helpers.sign = Math.sign ? function (x) {
            return Math.sign(x);
        } : function (x) {
            x = +x;
            if (x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        };
        helpers.log10 = Math.log10 ? function (x) {
            return Math.log10(x);
        } : function (x) {
            var exponent = Math.log(x) * Math.LOG10E;
            var powerOf10 = Math.round(exponent);
            var isPowerOf10 = x === Math.pow(10, powerOf10);
            return isPowerOf10 ? powerOf10 : exponent;
        };
        helpers.toRadians = function (degrees) {
            return degrees * (Math.PI / 180);
        };
        helpers.toDegrees = function (radians) {
            return radians * (180 / Math.PI);
        };
        helpers._decimalPlaces = function (x) {
            if (!helpers.isFinite(x)) {
                return;
            }
            var e = 1;
            var p = 0;
            while (Math.round(x * e) / e !== x) {
                e *= 10;
                p++;
            }
            return p;
        };
        helpers.getAngleFromPoint = function (centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x;
            var distanceFromYCenter = anglePoint.y - centrePoint.y;
            var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
            var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
            if (angle < -0.5 * Math.PI) {
                angle += 2 * Math.PI;
            }
            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        };
        helpers.distanceBetweenPoints = function (pt1, pt2) {
            return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
        };
        helpers.aliasPixel = function (pixelWidth) {
            return pixelWidth % 2 === 0 ? 0 : 0.5;
        };
        helpers._alignPixel = function (chart, pixel, width) {
            var devicePixelRatio = chart.currentDevicePixelRatio;
            var halfWidth = width / 2;
            return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
        };
        helpers.splineCurve = function (firstPoint, middlePoint, afterPoint, t) {
            var previous = firstPoint.skip ? middlePoint : firstPoint;
            var current = middlePoint;
            var next = afterPoint.skip ? middlePoint : afterPoint;
            var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
            var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
            var s01 = d01 / (d01 + d12);
            var s12 = d12 / (d01 + d12);
            s01 = isNaN(s01) ? 0 : s01;
            s12 = isNaN(s12) ? 0 : s12;
            var fa = t * s01;
            var fb = t * s12;
            return {
                previous: {
                    x: current.x - fa * (next.x - previous.x),
                    y: current.y - fa * (next.y - previous.y)
                },
                next: {
                    x: current.x + fb * (next.x - previous.x),
                    y: current.y + fb * (next.y - previous.y)
                }
            };
        };
        helpers.EPSILON = Number.EPSILON || 1e-14;
        helpers.splineCurveMonotone = function (points) {
            var pointsWithTangents = (points || []).map(function (point) {
                return {
                    model: point._model,
                    deltaK: 0,
                    mK: 0
                };
            });
            var pointsLen = pointsWithTangents.length;
            var i, pointBefore, pointCurrent, pointAfter;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) {
                    continue;
                }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointAfter && !pointAfter.model.skip) {
                    var slopeDeltaX = pointAfter.model.x - pointCurrent.model.x;
                    pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0;
                }
                if (!pointBefore || pointBefore.model.skip) {
                    pointCurrent.mK = pointCurrent.deltaK;
                } else if (!pointAfter || pointAfter.model.skip) {
                    pointCurrent.mK = pointBefore.deltaK;
                } else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
                    pointCurrent.mK = 0;
                } else {
                    pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
                }
            }
            var alphaK, betaK, tauK, squaredMagnitude;
            for (i = 0; i < pointsLen - 1; ++i) {
                pointCurrent = pointsWithTangents[i];
                pointAfter = pointsWithTangents[i + 1];
                if (pointCurrent.model.skip || pointAfter.model.skip) {
                    continue;
                }
                if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
                    pointCurrent.mK = pointAfter.mK = 0;
                    continue;
                }
                alphaK = pointCurrent.mK / pointCurrent.deltaK;
                betaK = pointAfter.mK / pointCurrent.deltaK;
                squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
                if (squaredMagnitude <= 9) {
                    continue;
                }
                tauK = 3 / Math.sqrt(squaredMagnitude);
                pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
                pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
            }
            var deltaX;
            for (i = 0; i < pointsLen; ++i) {
                pointCurrent = pointsWithTangents[i];
                if (pointCurrent.model.skip) {
                    continue;
                }
                pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
                pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
                if (pointBefore && !pointBefore.model.skip) {
                    deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
                    pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
                    pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
                }
                if (pointAfter && !pointAfter.model.skip) {
                    deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
                    pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
                    pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
                }
            }
        };
        helpers.nextItem = function (collection, index, loop) {
            if (loop) {
                return index >= collection.length - 1 ? collection[0] : collection[index + 1];
            }
            return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
        };
        helpers.previousItem = function (collection, index, loop) {
            if (loop) {
                return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
            }
            return index <= 0 ? collection[0] : collection[index - 1];
        };
        helpers.niceNum = function (range, round) {
            var exponent = Math.floor(helpers.log10(range));
            var fraction = range / Math.pow(10, exponent);
            var niceFraction;
            if (round) {
                if (fraction < 1.5) {
                    niceFraction = 1;
                } else if (fraction < 3) {
                    niceFraction = 2;
                } else if (fraction < 7) {
                    niceFraction = 5;
                } else {
                    niceFraction = 10;
                }
            } else if (fraction <= 1) {
                niceFraction = 1;
            } else if (fraction <= 2) {
                niceFraction = 2;
            } else if (fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
            return niceFraction * Math.pow(10, exponent);
        };
        helpers.requestAnimFrame = function () {
            if (typeof window === 'undefined') {
                return function (callback) {
                    callback();
                };
            }
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }();
        helpers.getRelativePosition = function (evt, chart) {
            var mouseX, mouseY;
            var e = evt.originalEvent || evt;
            var canvas = evt.target || evt.srcElement;
            var boundingRect = canvas.getBoundingClientRect();
            var touches = e.touches;
            if (touches && touches.length > 0) {
                mouseX = touches[0].clientX;
                mouseY = touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
            var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
            var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
            var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
            var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
            var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;
            mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / width * canvas.width / chart.currentDevicePixelRatio);
            mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / height * canvas.height / chart.currentDevicePixelRatio);
            return {
                x: mouseX,
                y: mouseY
            };
        };
        function parseMaxStyle(styleValue, node, parentProperty) {
            var valueInPixels;
            if (typeof styleValue === 'string') {
                valueInPixels = parseInt(styleValue, 10);
                if (styleValue.indexOf('%') !== -1) {
                    valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
                }
            } else {
                valueInPixels = styleValue;
            }
            return valueInPixels;
        }
        function isConstrainedValue(value) {
            return value !== undefined && value !== null && value !== 'none';
        }
        function getConstraintDimension(domNode, maxStyle, percentageProperty) {
            var view = document.defaultView;
            var parentNode = helpers._getParentNode(domNode);
            var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
            var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
            var hasCNode = isConstrainedValue(constrainedNode);
            var hasCContainer = isConstrainedValue(constrainedContainer);
            var infinity = Number.POSITIVE_INFINITY;
            if (hasCNode || hasCContainer) {
                return Math.min(hasCNode ? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity, hasCContainer ? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
            }
            return 'none';
        }
        helpers.getConstraintWidth = function (domNode) {
            return getConstraintDimension(domNode, 'max-width', 'clientWidth');
        };
        helpers.getConstraintHeight = function (domNode) {
            return getConstraintDimension(domNode, 'max-height', 'clientHeight');
        };
        helpers._calculatePadding = function (container, padding, parentDimension) {
            padding = helpers.getStyle(container, padding);
            return padding.indexOf('%') > -1 ? parentDimension * parseInt(padding, 10) / 100 : parseInt(padding, 10);
        };
        helpers._getParentNode = function (domNode) {
            var parent = domNode.parentNode;
            if (parent && parent.toString() === '[object ShadowRoot]') {
                parent = parent.host;
            }
            return parent;
        };
        helpers.getMaximumWidth = function (domNode) {
            var container = helpers._getParentNode(domNode);
            if (!container) {
                return domNode.clientWidth;
            }
            var clientWidth = container.clientWidth;
            var paddingLeft = helpers._calculatePadding(container, 'padding-left', clientWidth);
            var paddingRight = helpers._calculatePadding(container, 'padding-right', clientWidth);
            var w = clientWidth - paddingLeft - paddingRight;
            var cw = helpers.getConstraintWidth(domNode);
            return isNaN(cw) ? w : Math.min(w, cw);
        };
        helpers.getMaximumHeight = function (domNode) {
            var container = helpers._getParentNode(domNode);
            if (!container) {
                return domNode.clientHeight;
            }
            var clientHeight = container.clientHeight;
            var paddingTop = helpers._calculatePadding(container, 'padding-top', clientHeight);
            var paddingBottom = helpers._calculatePadding(container, 'padding-bottom', clientHeight);
            var h = clientHeight - paddingTop - paddingBottom;
            var ch = helpers.getConstraintHeight(domNode);
            return isNaN(ch) ? h : Math.min(h, ch);
        };
        helpers.getStyle = function (el, property) {
            return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
        };
        helpers.retinaScale = function (chart, forceRatio) {
            var pixelRatio = chart.currentDevicePixelRatio = forceRatio || typeof window !== 'undefined' && window.devicePixelRatio || 1;
            if (pixelRatio === 1) {
                return;
            }
            var canvas = chart.canvas;
            var height = chart.height;
            var width = chart.width;
            canvas.height = height * pixelRatio;
            canvas.width = width * pixelRatio;
            chart.ctx.scale(pixelRatio, pixelRatio);
            if (!canvas.style.height && !canvas.style.width) {
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px';
            }
        };
        helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
            return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
        };
        helpers.longestText = function (ctx, font, arrayOfThings, cache) {
            cache = cache || {};
            var data = cache.data = cache.data || {};
            var gc = cache.garbageCollect = cache.garbageCollect || [];
            if (cache.font !== font) {
                data = cache.data = {};
                gc = cache.garbageCollect = [];
                cache.font = font;
            }
            ctx.font = font;
            var longest = 0;
            helpers.each(arrayOfThings, function (thing) {
                if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
                    longest = helpers.measureText(ctx, data, gc, longest, thing);
                } else if (helpers.isArray(thing)) {
                    helpers.each(thing, function (nestedThing) {
                        if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
                            longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
                        }
                    });
                }
            });
            var gcLen = gc.length / 2;
            if (gcLen > arrayOfThings.length) {
                for (var i = 0; i < gcLen; i++) {
                    delete data[gc[i]];
                }
                gc.splice(0, gcLen);
            }
            return longest;
        };
        helpers.measureText = function (ctx, data, gc, longest, string) {
            var textWidth = data[string];
            if (!textWidth) {
                textWidth = data[string] = ctx.measureText(string).width;
                gc.push(string);
            }
            if (textWidth > longest) {
                longest = textWidth;
            }
            return longest;
        };
        helpers.numberOfLabelLines = function (arrayOfThings) {
            var numberOfLines = 1;
            helpers.each(arrayOfThings, function (thing) {
                if (helpers.isArray(thing)) {
                    if (thing.length > numberOfLines) {
                        numberOfLines = thing.length;
                    }
                }
            });
            return numberOfLines;
        };
        helpers.color = !color ? function (value) {
            console.error('Color.js not found!');
            return value;
        } : function (value) {
            if (value instanceof CanvasGradient) {
                value = defaults.global.defaultColor;
            }
            return color(value);
        };
        helpers.getHoverColor = function (colorValue) {
            return colorValue instanceof CanvasPattern || colorValue instanceof CanvasGradient ? colorValue : helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
        };
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