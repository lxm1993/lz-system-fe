'use strict'
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const helmet = require("koa-helmet");
const session = require('koa-session');
const render = require('koa-art-template');

const config = require('./config');
const router = require('./app/router');
const corsHandler = require('./app/middlewares/cors');
const { logger, accessLogger } = require('./app/utils/logger');
const app = new Koa();

app.use(accessLogger());
// 挂载日志模块
app.use(async (ctx, next) => {
    ctx.util = { logger: logger }
    await next()
});

app.keys = config.sessionSignedKey;
app.use(session(config.sessionConfig, app));

render(app, config.template);

app.use(bodyParser());
app.use(helmet());
app.use(cors(corsHandler));
app.use(router.routes());
app.use(require('koa-static')(config.static));
//捕获异常记录错误日志
app.on("error", (err, ctx) => {
    logger.error(err);
    console.log(new Date(), ":", err);
});
app.listen(config.port, () => {
    console.log(`[${new Date().toLocaleString()}] listening on port: ${config.port}`);
});