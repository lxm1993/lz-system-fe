/**
 * 权限校验中间件
 * @author xiaominliu
 * @date 2019-12-13
 */
const jwt = require('jsonwebtoken')

module.exports = function(ctx, next) {
    if (typeof ctx.request.headers.authorization === 'string') {
        let token = ctx.request.headers.authorization.slice(7)
        let userInfo = jwt.decode(token)
        ctx.user = userInfo
    }
    return next();
    // if (ctx.user) {
    //     return next();
    // }

    // if (ctx.path.startsWith('/api/')) {
    //     throw new Error('not login');
    // }

    // ctx.session.redirect = ctx.path;
    // ctx.redirect('/login');
    // return null;
};