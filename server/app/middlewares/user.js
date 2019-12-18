/**
 * 用户信息中间件
 * @author xiaominliu
 * @date 2019 - 12 - 13
 */
const jwt = require('jsonwebtoken')

module.exports = function(ctx, next) {
    if (typeof ctx.request.headers.authorization === 'string') {
        let token = ctx.request.headers.authorization.slice(7)
        let userInfo = jwt.decode(token)
        ctx.user = userInfo
    }
    return next();
};