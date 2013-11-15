var express = require('express'),
    db = require('./db'),
    app = require('./app'),
    started = false,
    start;

module.exports.start = start = function(callback) {
    if (!started) {
        started = true;
        db.init();
        app.init();
    }
    
    if (callback) callback.call(app);
};

if (require.main === module) {
    start();
}