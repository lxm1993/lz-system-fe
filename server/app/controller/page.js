/**
 * 渲染页面的控制器
 * @author liuxiaomin
 * @date 2019-12-13
 */

/**
 * 代售点
 * @param ctx
 */
exports.lzPlat = function(ctx) {
    const data = {
        user: ctx.user,
    };
    ctx.render('lzPlat', { data: JSON.stringify(data) });
};

/**
 * 管理平台
 * @param ctx
 */
exports.lzAdmin = function(ctx) {
    const data = {
        user: ctx.user,
    };
    ctx.render('lzAdmin', { data: JSON.stringify(data) });
};