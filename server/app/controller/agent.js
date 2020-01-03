/**
 * 商家相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const agentModel = require('../models/agent')
const { exportExcel } = require('../utils/export-util')

// 获取商家列表
exports.getAgents = async function(ctx) {
    ctx.body = await agentModel.getAgents(ctx.query)
}
// 新建更新商家
exports.saveAgent = async function(ctx) {
    const { id } = ctx.params
    const agent = ctx.request.body
    let effectRows = await agentModel.saveAgent(agent, id)
    if (effectRows === 0) {
        throw new Error('商家已存在')
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 导出
exports.agentsExport = async function(ctx) {
    let data = await agentModel.getAgents(ctx.query)
    let headers = ['ID', '代售点名称', '联系人', '联系电话', '商家地址', '支持票务类型', '出票时间段']
    let colums = ['id', 'agentName', 'manager', 'tel', 'address', 'serviceTypeIdsStr', 'serviceTimeStr']
    ctx.body = await exportExcel({ data, headers, colums, name: 'agentsExport' })
}