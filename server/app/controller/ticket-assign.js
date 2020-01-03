/**
 * 票量配置相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const ticketAssignModel = require('../models/ticket-assign')
const { exportExcel } = require('../utils/export-util')

// 获取票量配置列表
exports.getTicketAssigns = async function(ctx) {
    ctx.body = await ticketAssignModel.getTicketAssigns(ctx.query)
}
// 新建更新票量配置
exports.saveTicketAssign = async function(ctx) {
    const { id } = ctx.params
    const ticketAssign = ctx.request.body
    let effectRows = await ticketAssignModel.saveTicketAssign(ticketAssign, id)
    if (effectRows === 0) {
        throw new Error('票量配置已存在，请直接进行修改～')
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 导出票量配置
exports.ticketAssignExport = async function(ctx) {
    let data = await ticketAssignModel.getTicketAssigns(ctx.query)
    let headers = ['平台名称', '票务类型', '分配权重']
    let colums = ['platName', 'ticketTypeName', 'configStr']
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}