/**
 * 权限校验中间件
 * @author xiaominliu
 * @date 2019-12-13
 */

module.exports = function(ctx, next) {
    if (ctx.user) {
        return next();
    }

    if (ctx.path.startsWith('/api/')) {
        throw new Error('not login');
    }

    ctx.session.redirect = ctx.path;
    ctx.redirect('/login');
    return null;
};