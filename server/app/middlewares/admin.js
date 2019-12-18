/**
 * 管理员权限校验中间件
 * @author xiaominliu
 * @date 2019-12-13
 */

module.exports = function(ctx, next) {
    if (!ctx.user || !ctx.user.isManage) {
        throw { code: 401, message: '' }
    }
    return next();
};