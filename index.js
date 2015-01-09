/**
 * Initialize configurations
 */
var dotenv = require('dotenv');
dotenv.load();  // Initialize environment config

/**
 * Start server
 */
var Server = require('./server');

var server = new Server();
server.listen(process.env.PORT, function() {
    server.log.info('Started server on port %d in %s mode.', process.env.PORT, process.env.NODE_ENV);
});
