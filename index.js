var express = require('express'),
    db = require('./db'),
    app = require('./app');

db.init();
app.init();