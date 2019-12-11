/**
 * 渲染页面的控制器
 * @author liuxiaomin
 * @date 2019-09-25
 */

/**
 * 前台页面
 * @param ctx
 */
exports.lz = function(ctx) {
    ctx.render('lz');
};

exports.lzAdmin = function(ctx) {
    ctx.render('lz-admin');
};