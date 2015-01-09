module.exports = function(err, req, res, next) {
    if (!err) {
        next();
    }

    var status = err.status ? err.status : 500;
    var code = status;

    if (err.code) {
        code += '.' + err.code;
    }

    this.log.error(err);

    res.status(status).send({
        code: code,
        message: err.message
    });

};
