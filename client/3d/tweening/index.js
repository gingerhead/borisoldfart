'use strict';

var _ = require('lodash');
var Q = require('q');
var TWEEN = require('tween.js');

var proto = {
    isRunning: function isRunning() {
        return !!this._tweensNum.length;
    },

    stopTween: function stopTween(name) {
        var tween = this._tweens[name];

        if (!tween) { return; }

        tween.stop();
    },

    run: function run (obj, to, time, options) {
        var defer = Q.defer();

        options = options || {};
        var name = options.name || 'noname';

        function onDone () {
            self._tweensNum--;

            self._tweens[name] = null;

            defer.resolve();
        }

        var self = this;
        var tween = new TWEEN.Tween(obj)
            .to(to, time)
            .onUpdate(defer.notify.bind(defer))
            .onComplete(onDone)
            .onStop(onDone);

        this._tweens[name] = tween;

        _.each(options, function (option, name) {
            if (!_.isFunction(tween[name])) { return; }

            tween[name](option);
        });

        tween.start();
        this._tweensNum++;

        return defer.promise;
    },

    animate: function animate() {
        TWEEN.update();
    }
};

export const create = function create () {
    var instance =  _.create(proto, {
        _tweensNum: 0,
        _tweens: {},
        easing: TWEEN.Easing,
        interpolation: TWEEN.Interpolation,
    });

    return instance;
};
