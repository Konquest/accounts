var environment = process.env.NODE_ENV || 'development';

try {
    config = require.resolve('./' + environment);
} catch(e) {
    console.error("./config/" + environment + ".js not found. Please create one from sample.development.js");
    process.exit(e.code);
}

module.exports = require('./' + environment);