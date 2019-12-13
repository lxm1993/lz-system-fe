/**
 * 跨域中间件
 * @author xiaominliu
 * @date 2019-12-13
 */

module.exports = {
    origin: function(ctx) {
        if (ctx.url === '/test') {
            // 这里可以配置不运行跨域的接口地址
            return false;
        }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}