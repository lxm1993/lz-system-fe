/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order');
const homeModel = require('../models/home');
const _ = require('lodash')
const moment = require('moment');
moment.locale('zh-cn')

// home
exports.getOrdersWeek = async function(ctx) {
    ctx.body = await homeModel.getOrdersWeek(ctx.query)
}
exports.sumOrder = async function(ctx) {
    ctx.body = await homeModel.sumOrder()
}


// order
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
exports.dealOrderFailed = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.dealOrderFailed(id, operator);
    if (effectRows === 0) {
        throw new Error('更新失败');
    }
    ctx.body = { message: '更新成功' }
}
exports.changeOrderReceiptStatus = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.changeOrderReceiptStatus(id, operator);
    if (effectRows === 0) {
        throw new Error('更新失败');
    }
    ctx.body = { message: '更新成功' }
}