const nconf = require('nconf');

nconf.argv().env().file('config.json');
nconf.defaults({
    port: 3100,
    secret: 'secret',
    dbUrl: 'mongodb://localhost:27017/testapp',
    routePrefix: '/api',
    debug: true
});

module.exports = nconf;