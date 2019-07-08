const Koa = require('koa');
const app = new Koa();
const chat = require('./chat');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
    try {
        const message = await chat.subscribe();
        ctx.body = message;
    } catch (e) {
        console.log(e);
    }

});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if (!message) {
       return next();
    }

    chat.publish(message);
    ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
