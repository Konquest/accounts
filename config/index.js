var environment = process.env.NODE_ENV || 'development',
    fs = require('fs');

try {
    config = require.resolve('./' + environment);
} catch(e) {
    console.error("./config/" + environment + ".js not found. Creating one from sample.development.js...");
    //console.log("Try: cp ./config/sample.development.js ./config/" + environment + ".js");
    //process.exit(e.code);

    //fs.createReadStream('./config/sample.development.js').pipe(fs.createWriteStream('./config/' + environment + '.js'));

    // Synchronous Write
    fs.writeFileSync('./config/' + environment + '.js', fs.readFileSync('./config/sample.development.js'));
}

module.exports = require('./' + environment);
