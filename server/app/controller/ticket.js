/**
 * 票务相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const ticketTypeModel = require('../models/ticket-type');
const ticketCommissionModel = require('../models/ticket-commission');
const { exportExcel } = require('../utils/export-util')

// 获取票务类型列表
exports.getTicketTypes = async function(ctx) {
    ctx.body = await ticketTypeModel.getTicketTypes(ctx.query)
}
// 新建更新票务类型
exports.saveTicketType = async function(ctx) {
    const { id } = ctx.params;
    const ticketType = ctx.request.body;
    let effectRows = await ticketTypeModel.saveTicketType(ticketType, id);
    if (effectRows === 0) {
        throw new Error('票务类型已存在');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}

// 获取分佣配置列表
exports.getTicketCommissoins = async function(ctx) {
    ctx.body = await ticketCommissionModel.getTicketCommissoins(ctx.query)
}
// 新建更新分佣配置
exports.saveTicketCommissoin = async function(ctx) {
    const { id } = ctx.params;
    const ticketType = ctx.request.body;
    let effectRows = await ticketCommissionModel.saveTicketCommission(ticketType, id);
    if (effectRows === 0) {
        throw new Error('分佣配置已存在');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}

// 导出
exports.ticketCommissoinExport = async function(ctx) {
    let data = await ticketCommissionModel.getTicketCommissoins(ctx.query)
    let headers = ['ID', '票务类型', '平台名称', '分佣配置']
    let colums = ['id', 'ticketTypeName', 'platName', 'configStr']
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}
exports.ticketTypeExport = async function(ctx) {
    let data = await ticketTypeModel.getTicketTypes(ctx.query)
    let headers = ['ID', '票务类型']
    let colums = ['id', 'name']
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}