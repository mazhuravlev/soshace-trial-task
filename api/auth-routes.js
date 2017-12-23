const Router = require('koa-router');
const Record = require('./record');
const successResponse = require('./success-response');
const only = require('only');

function makeRouter(routePrefix) {
    const authenticatedRouter = new Router();
    authenticatedRouter.get(routePrefix + '/check', ctx => {
        ctx.status = 200;
        ctx.body = successResponse();
    });

    authenticatedRouter.get(routePrefix + '/logout', async (ctx, next) => {
        ctx.logout();
        ctx.status = 200;
        ctx.body = successResponse();
    });

    // Get all records for user
    authenticatedRouter.get(routePrefix + '/records', async (ctx, next) => {
        ctx.body = await Record.find({userId: ctx.state.user._id});
    });

    // Create record
    authenticatedRouter.post(routePrefix + '/records', async (ctx, next) => {
        const newRecord = new Record(only(ctx.request.body, 'date distance duration'));
        newRecord.userId = ctx.state.user._id;
        try {
            await newRecord.save();
            ctx.status = 204;
            ctx.body = successResponse();
        } catch (e) {
            ctx.throw(400, e);
        }
    });

    authenticatedRouter.param('id', async (id, ctx, next) => {
        const record = await Record.findOne({_id: id});
        if (!record) ctx.throw(404);
        if (!record.userId.equals(ctx.state.user._id)) ctx.throw(403);
        ctx.state.record = record;
        await next();
    });

    // Get single record
    authenticatedRouter.get(routePrefix + '/records/:id', async (ctx, id, next) => {
        ctx.body = ctx.state.record;
    });

    // Update record
    authenticatedRouter.put(routePrefix + '/records/:id', async (ctx, id, next) => {
        const record = ctx.state.record;
        const recordDto = ctx.request.body;
        record.date = recordDto.date;
        record.distance = recordDto.distance;
        record.duration = recordDto.duration;
        try {
            await record.save();
            ctx.body = successResponse();
            ctx.status = 204;
        } catch (e) {
            ctx.throw(500, e);
        }
    });

    // Delete record
    authenticatedRouter.delete(routePrefix + '/records/:id', async (ctx, id, next) => {
        try {
            await ctx.state.record.remove();
            ctx.body = successResponse();
            ctx.status = 204;
        } catch (e) {
            ctx.throw(500, e);
        }
    });

    return authenticatedRouter;
}

module.exports = (routePrefix) => makeRouter(routePrefix);