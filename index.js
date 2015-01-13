/**
 * Initialize configurations
 */
var package = require('./package.json');
var dotenv = require('dotenv');
dotenv.load();  // Initialize environment config

/**
 * Initialize logging
 */
global.log = require('bunyan')({
    name: package.name,
    level: process.env.LOG_LEVEL
});

/**
 * Start server
 */
var Server = require('./server');

var server = new Server();
server.listen(process.env.PORT, function() {
    log.info('Started server on port %d in %s mode.', process.env.PORT, process.env.NODE_ENV);
});
