/**
 * Initialize configurations
 */
var dotenv = require('dotenv');
dotenv.load();  // Initialize environment config

// require('./integration');

require('mongoose').connect(process.env.MONGO_URL);
require('./unit');
