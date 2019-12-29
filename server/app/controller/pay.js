/**
 * 结算API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const platModel = require('../models/pay');

// 获取所有结算列表
exports.getPayOrders = async function(ctx) {
    ctx.body = await platModel.getPayOrders(ctx.query)
}
// 修改结算状态
exports.changeOderPayStatus = async function(ctx) {
    const { date, agentId } = ctx.request.body;
    let effectRows = await platModel.changeOderPayStatus(date, agentId);
    ctx.body = { message: effectRows > 0 ? '更新成功' : '更新失败' }
}