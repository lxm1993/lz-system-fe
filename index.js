'use strict'
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const helmet = require("koa-helmet")
const render = require('koa-art-template')
const jwt = require('koa-jwt')

const config = require('./server/config')
// routes
const registerRouter = require('./server/routes')
//middlewares
const { loggerMiddleware } = require('./server/middlewares/logger')
const { errorHandler, responseHandler } = require('./server/middlewares/response')
const { corsHandler } = require('./server/middlewares/cors')

const app = new Koa()

// 跨域
app.use(
    cors({ methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'] }),
)

// Logger
app.use(loggerMiddleware)

// Error Handler
app.use(errorHandler)

// jwt验证错误的处理
// 放在jwt中间件挂载之前
app.use(function(ctx, next) {
    return next().catch((err) => {
        console.log(err)
        if (err.status === 401) {
            throw { code: 401, message: err.message }
            return
        }
        throw { code: err.code, message: err.message }
    });
});

// jwt
// app.use(
//     jwt({ secret: config.tokenSecret }).unless({
//         path: [
//             '/lz-admin',
//             '/lz',
//             '/favicon.ico',
//             '/login/callback',
//             '/api/login/callback',
//         ]
//     }));

// Global Middlewares
render(app, {
    root: config.template,
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
})
app.use(bodyParser())

// Helmet
app.use(helmet())

// Cors
app.use(cors(corsHandler))

// Routes
app.use(registerRouter())

// static
app.use(require('koa-static')(config.template));

// Response
app.use(responseHandler)

app.listen(config.port, () => {
    console.log('server启动3005端口！！')
})