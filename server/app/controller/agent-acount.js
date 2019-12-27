/**
 * 商家账户相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const agentAccountModel = require('../models/agent-acount');
const { enbcrypt } = require('../utils/bcrypt')

// 获取商家账户列表
exports.getAgentAccounts = async function(ctx) {
    const { agentId } = ctx.query;
    if (!agentId) {
        throw new Error('商家id为空');
    }
    ctx.body = await agentAccountModel.getAgentAccounts(ctx.query)
}
// 新建更新商家
exports.saveAgentAccount = async function(ctx) {
    const { id } = ctx.params;
    const agent = ctx.request.body;
    agent.password = agent.password ? await enbcrypt(agent.password) : ''
    let effectRows = await agentAccountModel.saveAgentAccount(agent, id);
    if (effectRows === 0) {
        throw new Error('用户名已存在，请换一个试试～');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 删除商家账户
exports.deleteAgentAccount = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await agentAccountModel.deleteAgentAccount(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
}

// 暂停启用商家账户
exports.changeAgentAccountStatus = async function(ctx) {
    const { id, status } = ctx.request.body;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await agentAccountModel.changeAgentAccountStatus(id, online);
    let statusStr = status === 0 ? '停用' : '启用'
    if (effectRows === 0) {
        throw new Error(`${statusStr}失败`);
    }
    ctx.body = { message: `${statusStr}成功` }
}