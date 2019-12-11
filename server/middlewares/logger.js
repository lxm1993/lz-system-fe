'use strict'

const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const logPath = require('../config').logPath

const logsDir = path.parse(logPath).dir
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

log4js.configure({
    appenders: {
        console: { type: 'console' },
        dateFile: { type: 'dateFile', filename: logPath, pattern: '-yyyy-MM-dd' }
    },
    categories: {
        default: {
            appenders: ['console', 'dateFile'],
            level: 'info'
        }
    }
})

const logger = log4js.getLogger('[Default]')

const loggerMiddleware = async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start

    let logText = `${ctx.method} ${ctx.status} ${ctx.url}- ${ms}ms 
    请求参数：${JSON.stringify(ctx.method === 'GET' ? ctx.request.query : ctx.request.body)}
    响应参数： `
    let responseObj = ['/api/basemappings', '/api/realtime', '/api/getMarketLines'].includes(ctx.path) ? '忽略显示' : ctx.body
    logger.info(logText, responseObj)
}

module.exports = {
    logger,
    loggerMiddleware
}
