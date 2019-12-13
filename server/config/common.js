/**
 * 公共配置
 * @author xiaominliu
 * @date 2019-09-26
 */
const path = require('path')

module.exports = {
    // 服务端口
    port: 3005,
    template: path.join(__dirname, '../../dist'),
    logPath: path.resolve(__dirname, '../logs/koa-logger.log'),
    tokenSecret: 'agdefhrhdkxlhgdwqlolxm',
    tokenExpireTime: '12h',
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