/**
 * 鉴权中间件
 * @author xiaominliu
 * @date 2019 - 12 - 13
 */
const accountModel = require('../models/account');

module.exports = async function(ctx, next) {
    let user = ctx.user
    if (!(user && user.id)) {
        throw { code: 401, message: '' }
    }
    let account = await accountModel.getAccount(user.id)
    if (!account) {
        throw { code: 401, message: '' }
    }
    if (account.online === 0) {
        throw { code: 401, message: '改账户已被禁用' }
    }
    ctx.user = account
    return next();
};