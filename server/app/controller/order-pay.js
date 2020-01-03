/**
 * 结算API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const platModel = require('../models/order-pay');
const { exportExcel } = require('../utils/export-util')

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
exports.paysExport = async function(ctx) {
    let data = await platModel.getPayOrders(ctx.query)
    let headers = ['日期', '代售点名称', '结算金额', '结算状态']
    let colums = ['date', 'agentName', 'payMoneys', 'payStr']
    data.rows = data.rows.map(item => {
        return {
            ...item,
            payStr: item.isPay ? '已结算' : '未结算'
        }
    })
    ctx.body = await exportExcel({ data, headers, colums, name: 'paysExport' })
}