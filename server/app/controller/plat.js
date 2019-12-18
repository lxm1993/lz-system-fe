/**
 * 平台相关API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const platModel = require('../models/plat');

// 获取平台列表
exports.getPlats = async function(ctx) {
    ctx.body = await platModel.getPlats(ctx.query)
}
// 新建更新平台
exports.savePlat = async function(ctx) {
    const { id } = ctx.params;
    const plat = ctx.request.body;
    let effectRows = await platModel.savePlat(plat, id);
    if (effectRows === 0) {
        throw new Error('平台已存在');
    }
    ctx.body = { message: id ? '更新成功' : '添加成功' }
}
// 删除平台
exports.deletePlat = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('id为空');
    }
    let effectRows = await platModel.deletePlat(id);
    if (effectRows === 0) {
        throw new Error('删除失败');
    }
    ctx.body = { message: '删除成功' }
}