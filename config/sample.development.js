module.exports = {
    port: 8080,
    db: 'mongodb://localhost/accounts',
    oauth2: {
        features: {
            client: true,
            code: true,
            implicit: true,
            password: true
        },
        authorizationCode: { expires: 600 },    // 10 minutes
        accessToken: { length: 256, expires: 3600 },     // 1 hour
        refreshToken: { length: 256, expires: 86400 * 365 }    // 1 year = 1 day * 365
    }
};