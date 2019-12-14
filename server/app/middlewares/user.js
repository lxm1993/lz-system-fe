/**
 * 用户信息中间件
 * @author xiaominliu
 * @date 2019 - 12 - 13
 */

const { env, mockUser } = require('../../config');

module.exports = function(ctx, next) {
    if (env === 'dev' && mockUser) {
        // ctx.user = mockUser;
        ctx.user = ctx.session.user;
    } else if (ctx.session.user) {
        ctx.user = ctx.session.user;
    }
    return next();
};