const log4js = require('koa-log4');
const path = require('path');
const config = require('../../config');

log4js.configure({
    appenders: {
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log', //生成文件的规则
            filename: path.join(config.logPath, 'access.log') //生成文件名
        },
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.join(config.logPath, 'application.log')
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'info' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'WARN' }
    }
});
//记录所有访问级别的日志
exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access'));
//记录所有应用级别的日志
exports.logger = log4js.getLogger('application');