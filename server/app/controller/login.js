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
const { createToken } = require('../utils/jwt')
exports.login = async function(ctx) {
    const { username, password } = ctx.query;
    try {
        // ctx.session.user = await userService.loginWithTicket(ticket);
        let user = {
            account_name: username,
            is_manage: username === 'aa' ? true : false,
            agent_id: 133,
        };
        let token = await createToken(user)
        ctx.body = {
            user: user,
            token: token,
            userType: user.is_manage ? 'lz-admin' : 'lz-plat',
        }
    } catch (e) {
        throw Error(e.message)
    }
}
exports.getLoginUser = async function(ctx) {
    ctx.body = ctx.user
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