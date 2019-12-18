/**
 * 商家相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const agentModel = require('../models/agent');

// 获取商家列表
exports.getAgents = async function(ctx) {
    ctx.body = await agentModel.getAgents(ctx.query)
}
// 新建更新商家
exports.saveAgent = async function(ctx) {
    const { id } = ctx.params;
    const agent = ctx.request.body;
    let effectRows = await agentModel.saveAgent(agent, id);
    if (effectRows === 0) {
        throw new Error('商家已存在');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 删除商家
exports.deleteAgent = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await agentModel.deleteAgent(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
}