/**
 * 票务相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const ticketTypeModel = require('../models/ticket-type');
const ticketCommissionModel = require('../models/ticket-commission');

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
// 删除票务类型
exports.deleteTicketType = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await ticketTypeModel.deleteTicketType(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
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
// 删除分佣配置
exports.deleteTicketCommissoin = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await ticketCommissionModel.deleteTicketCommission(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
}