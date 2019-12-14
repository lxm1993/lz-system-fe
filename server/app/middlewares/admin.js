/**
 * 管理员权限校验中间件
 * @author xiaominliu
 * @date 2019-12-13
 */

module.exports = function(ctx, next) {
    if (!ctx.user || !ctx.user.is_manage) {
        ctx.throw(401);
    }
    return next();
};