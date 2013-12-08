var express = require('express'),
    async = require('async'),
    db = require('./db'),
    app = require('./app'),
    started = false,
    start;

module.exports.start = start = function(callback) {
    if (!started) {
        async.series([db.init, app.init], function() {
            started = true;
            console.log('Server ready to go');
            if (callback) callback.call(app);
        });
    } else {
        if (callback) callback.call(app);
    }
};

module.exports.stop = function(callback) {
    if (started) {
        async.parallel([app.close, db.close], function() {
            started = false;
            console.log('Server shut down');
            if (callback) callback.call(app);
        });
    } else {
        if (callback) callback.call(app);
    }
};

if (require.main === module) {
    start();
}