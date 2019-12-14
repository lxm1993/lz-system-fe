/**
 * 公共配置
 * @author xiaominliu
 * @date 2019-09-26
 */
const path = require('path')

module.exports = {
    // 服务端口
    port: 3005,
    // 静态资源目录位置
    static: path.join(__dirname, '../../dist'),

    // 错误日志
    logPath: path.resolve(__dirname, '../../logs/'),

    // 模板设置
    template: {
        root: path.join(__dirname, '../../dist'),
        extname: '.art',
        debug: process.env.NODE_ENV !== 'production',
    },

    // session使用的key
    sessionSignedKey: ['$lz^adminkey$'],
    sessionConfig: {
        key: 'koa:sess',
        maxAge: 86400000,
        httpOnly: true,
        /** 是否每次响应时刷新Session的有效期。(默认是 false) */
        rolling: true,
        /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
        renew: false,
    },

    // 数据库
    lzDataBase: {
        host: '118.25.80.216',
        port: '3306',
        user: 'lxmlz',
        password: 'yclxm1993',
        database: 'lz_test',
        charset: 'utf8mb4', //utf8mb4才能保存emoji
        connectionLimit: 100 //连接数量
    },

}