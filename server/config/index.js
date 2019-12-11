/**
 * 配置集合，process.env.NODE_ENV通过外部设置
 * @author xiaominliu
 * @date 2019-09-26
 */

'use strict';

const _ = require('lodash');
const dev = require('./dev');
const test = require('./test');
const prod = require('./production');
const common = require('./common');

let config = {
    env: process.env.NODE_ENV,
};

/**
 * 支持的调用方式举例：
 * node index.js 5555 -> 使用5555端口启动
 */
function rewriteConfigFromArgv() {
    if (process.argv[2] > 0) {
        config.port = process.argv[2];
    }
}

switch (process.env.NODE_ENV) {
    case 'production':
        config = _.merge(config, common, prod);
        break;
    case 'test':
        config = _.merge(config, common, test);
        rewriteConfigFromArgv();
        break;
    case 'dev':
    default:
        config = _.merge(config, common, dev);
        rewriteConfigFromArgv();
}

module.exports = config;
