/**
 * 票务配置相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const ticketAssignModel = require('../models/ticket-assign');

// 获取票务类型列表
exports.getTicketAssigns = async function(ctx) {
    ctx.body = await ticketAssignModel.getTicketAssigns(ctx.query)
}
// 新建更新票务类型
exports.saveTicketAssign = async function(ctx) {
    const { id } = ctx.params;
    const ticketAssign = ctx.request.body;
    let effectRows = await ticketAssignModel.saveTicketAssign(ticketAssign, id);
    if (effectRows === 0) {
        throw new Error('票务配置已存在，请直接进行修改～');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 删除票务类型
exports.deleteTicketAssign = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await ticketAssignModel.deleteTicketAssign(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
}