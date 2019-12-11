/**
 * 公共配置
 * @author xiaominliu
 * @date 2019-09-26
 */
const path = require('path')

module.exports = {
    // 服务端口
    port: 3005,
    logPath: path.resolve(__dirname, '../logs/koa-logger.log'),
    template: path.join(__dirname, '../../client/dist'),
    tokenSecret: 'agdefhrhdkxlhgdwqlolxm',
    tokenExpireTime: '12h',
    // troubleShooting数据库
    troubleShootingDataBase: {
        host: '10.18.56.217',
        port: '3306',
        user: 'fe_test_rw',
        password: 'h6ch6EYccA521V8',
        database: 'fe_test',
        charset: 'utf8mb4', //utf8mb4才能保存emoji
        connectionLimit: 100 //连接数量
    },

}