define([
    './core.defaults',
    '../helpers/index'
], function (__module__0, __module__1) {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    var defaults = __module__0;
    var helpers = __module__1;
    defaults._set('global', {
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
            onProgress: helpers.noop,
            onComplete: helpers.noop
        }
    });
    module.exports = {
        animations: [],
        request: null,
        addAnimation: function (chart, animation, duration, lazy) {
            var animations = this.animations;
            var i, ilen;
            animation.chart = chart;
            animation.startTime = Date.now();
            animation.duration = duration;
            if (!lazy) {
                chart.animating = true;
            }
            for (i = 0, ilen = animations.length; i < ilen; ++i) {
                if (animations[i].chart === chart) {
                    animations[i] = animation;
                    return;
                }
            }
            animations.push(animation);
            if (animations.length === 1) {
                this.requestAnimationFrame();
            }
        },
        cancelAnimation: function (chart) {
            var index = helpers.findIndex(this.animations, function (animation) {
                return animation.chart === chart;
            });
            if (index !== -1) {
                this.animations.splice(index, 1);
                chart.animating = false;
            }
        },
        requestAnimationFrame: function () {
            var me = this;
            if (me.request === null) {
                me.request = helpers.requestAnimFrame.call(window, function () {
                    me.request = null;
                    me.startDigest();
                });
            }
        },
        startDigest: function () {
            var me = this;
            me.advance();
            if (me.animations.length > 0) {
                me.requestAnimationFrame();
            }
        },
        advance: function () {
            var animations = this.animations;
            var animation, chart, numSteps, nextStep;
            var i = 0;
            while (i < animations.length) {
                animation = animations[i];
                chart = animation.chart;
                numSteps = animation.numSteps;
                nextStep = Math.floor((Date.now() - animation.startTime) / animation.duration * numSteps) + 1;
                animation.currentStep = Math.min(nextStep, numSteps);
                helpers.callback(animation.render, [
                    chart,
                    animation
                ], chart);
                helpers.callback(animation.onAnimationProgress, [animation], chart);
                if (animation.currentStep >= numSteps) {
                    helpers.callback(animation.onAnimationComplete, [animation], chart);
                    chart.animating = false;
                    animations.splice(i, 1);
                } else {
                    ++i;
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