const Koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-route');
const session = require('koa-session');
const bodyparser = require('koa-bodyparser');
const nconf = require('nconf');
const mongoose = require('mongoose');
const Record = require('./record');
const User = require('./user');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const only = require('only');

nconf.argv().env().file('config.json');
nconf.defaults({
    port: 3100,
    secret: 'secret',
    dbUrl: 'mongodb://localhost:27017/testapp'
});

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({username: username});
    if (!user) {
        done('user not found');
    }
    if (user.password !== password) {
        done('wrong password');
    }
    done(null, user);
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

mongoose.Promise = Promise;
mongoose.connect(nconf.get('dbUrl')).then(() => console.log('[Mongo] connect'))
    .catch(e => console.error('[Mongo] failed to connect', e));

const app = new Koa();
app.keys = [nconf.get('secret')];
app.use(logger());
app.use(session({}, app));
app.use(bodyparser());
app.use(passport.initialize());
app.use(passport.session());

app.use(route.post('/register', async (ctx, next) => {
    const userDto = ctx.request.body;
    const user = await User.findOne({username: userDto.username});
    if (user) {
        ctx.throw(400, 'Username is busy');
    }
    const newUser = new User(only(userDto, 'username password'));
    try {
        await newUser.save();
    } catch (e) {
        ctx.throw(500, 'Failed to save user');
    }
    ctx.status = 201;
    ctx.body = 'OK';
}));

app.use(route.post('/login', async (ctx, next) => {
    await passport.authenticate('local', async (err, user) => {
        if (err) {
            ctx.throw(401, err);
        }
        if (user) {
            await ctx.login(user);
            ctx.body = 'OK';
        } else {
            ctx.throw(500, 'Login error');
        }
    })(ctx);
}));

app.use(async (ctx, next) => {
    if (!ctx.isAuthenticated()) ctx.throw(401);
    await next();
});

app.use(route.get('/logout', async (ctx, next) => {
    await next();
}));

app.use(route.get('/records', async (ctx, next) => {
    ctx.body = await Record.find({userId: ctx.state.user._id});
}));

app.use(route.post('/records', async (ctx, next) => {
    const newRecord = new Record(only(ctx.request.body, 'date distance duration'));
    newRecord.userId = ctx.state.user._id;
    try {
        await newRecord.save();
        ctx.status = 201;
        ctx.body = 'OK';
    } catch (e) {
        ctx.throw(400, e);
    }
}));

app.use(route.put('/records', async (ctx, next) => {
    const modelDto = ctx.request.body;
    let record;
    try {
        record = await Record.findOne({_id: modelDto._id});
    } catch (e) {
        ctx.throw(400, e);
        return;
    }
    if (!record) ctx.throw(404, 'Record not found');
    if (!record.userId.equals(ctx.state.user._id)) ctx.throw(401);
    record.date = modelDto.date;
    record.distance = modelDto.distance;
    record.duration = modelDto.duration;
    try {
        await record.save();
        ctx.body = 'OK';
    } catch (e) {
        ctx.throw(400, e);
    }
}));

app.use(route.delete('/records', async (ctx, next) => {
    const record = await Record.findOne({_id: ctx.request.body._id});
    if (!record) ctx.throw(404, 'Record not found');
    if (!record.userId.equals(ctx.state.user._id)) ctx.throw(401);
    try {
        await record.remove();
        ctx.body = 'OK';
    } catch (e) {
        ctx.throw(400, e);
    }
}));

app.listen(nconf.get('port'), () => console.log(`Listening on ${nconf.get('port')}`));