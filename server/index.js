'use strict'
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const helmet = require("koa-helmet");
const render = require('koa-art-template');
const jwt = require('koa-jwt');


const config = require('./config');
const router = require('./app/router');
const corsHandler = require('./app/middlewares/cors');
const { cspConfig } = require('./app/middlewares/helmet');
const { logger, accessLogger } = require('./app/utils/logger');
const app = new Koa();

app.use(accessLogger());
app.use(cors(corsHandler));
// 挂载日志模块
app.use(async (ctx, next) => {
    ctx.util = { logger: logger }
    await next()
});
// jwt验证错误的处理 放在jwt中间件挂载之前
app.use(function(ctx, next) {
    return next().catch((err) => {
        if (err.message === 'Authentication Error') {
            ctx.body = {
                code: 401,
                message: err.message,
            };
        }
        console.log(err)
    });
});
// jwt
app.use(jwt({ secret: config.token.secret }).unless({
    path: [
        '/', '/lz-admin', '/lz-plat', '/login',
        '/report-violation', /\/static/, '/favicon.ico'
    ]
}));
render(app, config.template);
app.use(bodyParser());
app.use(helmet());
app.use(helmet.contentSecurityPolicy(cspConfig))
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