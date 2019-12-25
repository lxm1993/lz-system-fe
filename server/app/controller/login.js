/**
 * 登陆相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const accountModel = require('../models/account');
const { createToken } = require('../utils/jwt');

// 用户登录
exports.login = async function(ctx) {
    let { username, password, admin } = ctx.query;
    if (!username || !password) {
        throw new Error('用户名或密码为空');
    }
    // password = await decrypt(password)
    let account = await accountModel.getLoginAccount(username, password, admin)
    if (!account) {
        throw new Error('用户名或密码错误');
    }
    if (account.online === 0) {
        throw new Error('抱歉，改用户已被禁用，请联系管理员修改～');
    }
    let token = await createToken(account)
    ctx.body = {
        user: account,
        token: token,
        userType: account.isManage === 1 ? 'lz-admin' : 'lz-plat',
    }
}
exports.getLoginUser = async function(ctx) {
    ctx.body = ctx.user
}