/**
 * 响应格式化中间件
 * @author xiaominliu
 * @date 2019 - 12 - 13
 */

module.exports = async function(ctx, next) {
    try {
        await next()
        const data = ctx.body;
        if (ctx.path.includes('export-excel')) {
            ctx.body = data

        } else {
            ctx.body = {
                code: 200,
                data: data || ''
            }
        }
    } catch (e) {
        ctx.util.logger.error([`${ctx.status} ${ctx.method} ${ctx.path}`, e.stack]
            .filter(Boolean).join('\n'));
        // @TODO 区分系统错误和用户错误
        ctx.body = {
            code: e.code || 500,
            message: e.message,
        }
    }
};