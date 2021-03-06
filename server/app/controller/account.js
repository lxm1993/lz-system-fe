/**
 * 商家内部用户账号API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const accountModel = require('../models/account');
const { enbcrypt } = require('../utils/bcrypt')
const { exportExcel } = require('../utils/export-util')

// 获取管理员账户列表
exports.getManageAccounts = async function(ctx) {
    ctx.body = await accountModel.getManageAccounts(ctx.query)
}
// 新建更新用户
exports.saveAccount = async function(ctx) {
    const { id } = ctx.params;
    const account = ctx.request.body;
    account.password = account.password ? await enbcrypt(account.password) : ''
    let effectRows = await accountModel.saveAccount(account, id);
    if (effectRows === 0) {
        throw new Error('用户名已存在，请换一个试试～');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 导出
exports.accountExports = async function(ctx) {
    let data = await accountModel.getManageAccounts(ctx.query)
    let headers = ['用户ID', '用户名', '创建时间', '修改时间']
    let colums = ['id', 'accountName', 'createTime', 'modifyTime']
    ctx.body = await exportExcel({ data, headers, colums, name: 'accountExports' })
}


// 删除用户
// exports.deleteAccount = async function(ctx) {
//     const { id } = ctx.params;
//     if (!id) {
//         throw new Error('id为空');
//     }
//     let effectRows = await accountModel.deleteAccount(id);
//     if (effectRows === 0) {
//         throw new Error('删除失败');
//     }
//     ctx.body = { message: '删除成功' }
// }