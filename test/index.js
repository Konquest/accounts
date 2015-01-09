/**
 * Initialize configurations
 */
var dotenv = require('dotenv');
dotenv.load();  // Initialize environment config

require('./integration');
require('./unit');
