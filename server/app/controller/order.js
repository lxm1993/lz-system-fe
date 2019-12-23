/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order');
const _ = require('lodash')
const moment = require('moment');
moment.locale('zh-cn')

// 一周订单
exports.getOrdersWeek = async function(ctx) {
    ctx.body = await orderModel.getOrdersWeek(ctx.query)
}
// 获取全部表
exports.getOrders = async function(ctx) {
    ctx.body = await orderModel.getOrders(ctx.query)
}
exports.getOrder = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    ctx.body = await orderModel.getOrder(id)
}
exports.sumOrder = async function(ctx) {
    ctx.body = await orderModel.sumOrder()
}