/**
 * 平台相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const platModel = require('../models/plat')
const { exportExcel } = require('../utils/export-util')

// 获取平台列表
exports.getPlats = async function(ctx) {
    ctx.body = await platModel.getPlats(ctx.query)
}
// 新建更新平台
exports.savePlat = async function(ctx) {
    const { id } = ctx.params
    const plat = ctx.request.body
    let effectRows = await platModel.savePlat(plat, id)
    if (effectRows === 0) {
        throw new Error('平台已存在')
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
exports.platsExport = async function(ctx) {
    let data = await platModel.getPlats(ctx.query)
    let headers = ['ID', '平台名称', '联系人', '联系电话', '备注']
    let colums = ['id', 'platName', 'manager', 'tel', 'remark']
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}