/**
 * 代售点订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order');
const homeModel = require('../models/home');
const _ = require('lodash')
const moment = require('moment');
moment.locale('zh-cn')

// home
// 一周订单
exports.getAgentOrdersWeek = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    ctx.body = await homeModel.getOrdersWeek(query)
}
exports.sumAgentOrder = async function(ctx) {
    ctx.body = await homeModel.sumAgentOrder(ctx.user.agentId)
}

//order
// 代售点订单列表
exports.getAgentOrders = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    let data = await orderModel.getOrders(query)
    ctx.body = data
}

exports.getAgentOrder = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let order = await orderModel.getOrder(id)
    let fromTime = order.from_time
    let dealOrder = {
        ...order,
        fromTime: fromTime && `${moment(fromTime).format("YYYY-MM-DD")} ${moment(fromTime).format('dddd')}`,
        fromStation: fromTime && `${order.start_station_name} ${moment(fromTime).format("hh:mm")}`,
        toStation: `${order.arrive_station_name} ${moment(order.arrive_time).format("hh:mm")}`,
    }
    ctx.body = dealOrder
}

exports.getUnDealOrders = async function(ctx) {
    ctx.body = await orderModel.getUnDealOrders(ctx.user.agentId)
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
exports.dealOrderSuccess = async function(ctx) {
    const { id } = ctx.params;
    const subOders = ctx.request.body || [];
    if (!id) {
        throw new Error('订单id不存在');
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.dealOrderSuccess(id, operator, subOders);
    if (effectRows === 0) {
        throw new Error('更新失败');
    }
    ctx.body = { message: '更新成功' }
}
exports.getSubSeats = async function(ctx) {
    const { type } = ctx.params;
    ctx.body = { data: await orderModel.getSubSeats(type) }
}