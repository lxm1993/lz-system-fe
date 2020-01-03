/**
 * 商家账户相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const agentAccountModel = require('../models/agent-acount')
const { enbcrypt } = require('../utils/bcrypt')
const { exportExcel } = require('../utils/export-util')

// 获取商家账户列表
exports.getAgentAccounts = async function(ctx) {
    const { agentId } = ctx.query
    if (!agentId) {
        throw new Error('商家id为空')
    }
    ctx.body = await agentAccountModel.getAgentAccounts(ctx.query)
}
// 新建更新商家
exports.saveAgentAccount = async function(ctx) {
    const { id } = ctx.params
    const agent = ctx.request.body
    agent.password = agent.password ? await enbcrypt(agent.password) : ''
    let effectRows = await agentAccountModel.saveAgentAccount(agent, id)
    if (effectRows === 0) {
        throw new Error('用户名已存在，请换一个试试～')
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 导出
exports.agentAccountExport = async function(ctx) {
    const { agentId } = ctx.query
    if (!agentId) {
        throw new Error('商家id为空')
    }
    let data = await agentAccountModel.getAgentAccounts(ctx.query)
    let headers = ['用户ID', '用户名', '所属商家', '创建时间', '修改时间']
    let colums = ['id', 'accountName', 'agentName', 'createTime', 'modifyTime']
    ctx.body = await exportExcel({ data, headers, colums, name: 'agentsExport' })
}