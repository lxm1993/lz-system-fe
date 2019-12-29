/**
 * 代售点订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order');
const _ = require('lodash')
const moment = require('moment');
moment.locale('zh-cn')

// 一周订单
exports.getAgentOrdersWeek = async function(ctx) {
    let query = {
        ...ctx.query,
        agentId: ctx.user.agentId,
    }
    ctx.body = await orderModel.getOrdersWeek(query)
}

// 代售点订单列表
exports.getAgentOrders = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    let data = await orderModel.getOrders(query)
    data = {
        total: data.total,
        rows: data.rows.map(item => {
            return _.pick(item, [
                'id', 'tickettype_name', 'contacts_telephone', 'passengers', 'train_code',
                'start_station_name', 'arrive_station_name', 'ticket_count',
                'gmt_create', 'close_time', 'operator', 'orderStatusStr',
                'payStatusStr', 'status'
            ])
        })
    }
    ctx.body = data
}

exports.getAgentOrder = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let order = await orderModel.getOrder(id)
    let originData = _.pick(order, ['id', 'seatRequirement', 'isChangeStr', 'train_type', 'train_code', 'status',
        'tickettype_name', 'contacts_telephone', 'subOrders',
        'gmt_create', 'close_time', 'limit_time'
    ])
    let fromTime = order.from_time
    let dealOrder = {
        ...originData,
        fromTime: fromTime && `${moment(fromTime).format("YYYY-MM-DD")} ${moment(fromTime).format('dddd')}`,
        fromStation: fromTime && `${order.start_station_name} ${moment(fromTime).format("hh:mm")}`,
        toStation: `${order.arrive_station_name} ${moment(order.arrive_time).format("hh:mm")}`,
    }
    ctx.body = dealOrder
}

exports.sumAgentOrder = async function(ctx) {
    ctx.body = await orderModel.sumAgentOrder(ctx.user.agentId)
}

exports.dealOrder = async function(ctx) {
    const { id } = ctx.params;
    const { status, subOrders } = ctx.request.body;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let effectRows = await orderModel.dealOrder({
        orderId: id,
        operator: ctx.user.accountName,
        status,
        subOrders,
    });
    if (effectRows === 0) {
        throw new Error('修改失败');
    }
    ctx.body = { status: 1 }
}
exports.getUnDealOrders = async function(ctx) {
    ctx.body = await orderModel.getUnDealOrders(ctx.user.agentId)
}