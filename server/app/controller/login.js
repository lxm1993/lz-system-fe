/**
 * 登陆相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */

/**
 * 用户登录
 * 此页面为用户主动访问，将回调地址给前端跳转
 * @param ctx
 * @returns {Promise<void>}
 */
exports.login = async function(ctx) {
    const { username, password } = ctx.query;

    if (ctx.user) {
        ctx.redirect(ctx.session.redirect || '/');
        return;
    }
    if (!username || !password) {
        ctx.render('login');
        return;
    }
    try {
        // ctx.session.user = await userService.loginWithTicket(ticket);
        let user = {
            account_name: username,
            is_manage: true,
            agent_id: 133,
        };
        ctx.session.user = user;
        let url = user.is_manage ? '/lz-admin' : '/lz-plat'
        ctx.body = {
            code: 200,
            data: { redirect: url }
        }
    } catch (e) {
        const data = {
            errMessage: e.message,
        };
        ctx.render('login', { data: JSON.stringify(data) });
    }
}
/**
 * 退出登录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.logout = async function(ctx) {
    ctx.session.user = null;
    ctx.redirect('/login');
}