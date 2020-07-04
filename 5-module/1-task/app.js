const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let responses = [];

router.get('/subscribe', async (ctx, next) => {
  responses.push(ctx.response);
  await new Promise((resolve) => {
    let interval = setInterval(() => {
      if (ctx.res.finished) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
});

router.post('/publish', async (ctx, next) => {
  let message = ctx.request.body.message;
  if (message) {
    responses.forEach(response => {
      response.status = 200;
      response.res.end(message);
    });
    responses = [];
  }
  ctx.response.status = 200;
  ctx.res.end('Ok');
});

app.use(router.routes());

module.exports = app;
