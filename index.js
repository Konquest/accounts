var express = require('express'),
    db = require('./db'),
    app = require('./app'),
    start;

module.exports.start = start = function(callback) {
    db.init();
    app.init();
    
    if (callback) callback.call(app);
};

if (require.main === module) {
    start();
}