const Router = require('koa-router');
const User = require('./user');
const passport = require('koa-passport');
const successResponse = require('./success-response');
const only = require('only');

function makeRouter(routePrefix) {
    const router = new Router();

    router.post(routePrefix + '/register', async (ctx, next) => {
        const userDto = ctx.request.body;
        const user = await User.findOne({username: userDto.username});
        if (user) {
            ctx.throw(400, 'Username is busy');
        }
        const newUser = new User(only(userDto, 'username password name surname'));
        try {
            await newUser.save();
        } catch (e) {
            ctx.throw(500, 'Failed to create account');
        }
        ctx.status = 204;
        ctx.body = successResponse();
    });

    router.post(routePrefix + '/login', async (ctx, next) => {
        await passport.authenticate('local', async (err, user) => {
            if (err) {
                ctx.throw(400, err);
            } else if (user) {
                await ctx.login(user);
                ctx.body = successResponse();
                ctx.status = 200;
            } else {
                ctx.throw(500, 'Login error');
            }
        })(ctx);
    });
    return router;
}

module.exports = (routePrefix) =>  makeRouter(routePrefix);