/**
 * 登陆相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const accountModel = require('../models/account');
const { createToken } = require('../utils/jwt');
const { decrypt } = require('../utils/crypto');


// 用户登录
exports.login = async function(ctx) {
    let { username, password, admin } = ctx.query;
    if (!username || !password) {
        throw { code: 500, message: '用户名或密码为空' }
    }
    password = await decrypt(password)
    let account = await accountModel.getLoginAccount(username, password, admin)
    if (!account) {
        throw { code: 500, message: '用户名或密码错误' }
    }
    let token = await createToken(account)
    ctx.body = {
        user: account,
        token: token,
        userType: account.isManage === 1 ? 'lz-admin' : 'lz-plat',
    }
}
exports.getLoginUser = async function(ctx) {
    let username = ctx.user.accountName
    let account = await accountModel.getLoginAccount(username)
    ctx.body = account
}