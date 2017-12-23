const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyparser = require('koa-bodyparser');
const nconf = require('./set-nconf');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const passport = require('koa-passport');

mongoose.connect(nconf.get('dbUrl')).then(() => console.log('[Mongo] connect'))
    .catch(e => console.error('[Mongo] failed to connect', e));

const app = new Koa();
app.keys = [nconf.get('secret')];
app.use(logger());
app.use(session({}, app));
app.use(bodyparser());

require('./set-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes')(nconf.get('routePrefix')).routes());
app.use(async (ctx, next) => {
    if (!ctx.isAuthenticated()) ctx.throw(401);
    await next();
});
app.use(require('./auth-routes')(nconf.get('routePrefix')).routes());

app.listen(nconf.get('port'), () => console.log(`Listening on ${nconf.get('port')}`));