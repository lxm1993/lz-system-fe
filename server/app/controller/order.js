/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order');
const _ = require('lodash')
const moment = require('moment');
moment.locale('zh-cn')
// 获取全部表
exports.getOrders = async function(ctx) {
    ctx.body = await orderModel.getOrders(ctx.query)
}
// 代售点订单列表
exports.getAgentOrders = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId
    }
    let data = await orderModel.getOrders(query)
    data = {
        total: data.total,
        rows: data.rows.map(item => {
            return _.pick(item, [
                'id', 'tickettype_name', 'telephone', 'passengers', 'train_code',
                'start_station_name', 'arrive_station_name', 'ticket_count',
                'gmt_create', 'gmt_modify', 'operator', 'limit_time', 'orderStatusStr',
                'payStatusStr'
            ])
        })
    }
    ctx.body = data
}
exports.getOrder = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    ctx.body = await orderModel.getOrder(id)
}

exports.getAgentOrder = async function(ctx) {
    const { id } = ctx.params;
    if (!id) {
        throw new Error('订单id不存在');
    }
    let order = await orderModel.getOrder(id)
    let originData = _.pick(order, ['seatRequirement', 'isChangeStr', 'train_code',
        'seat_type', 'telephone', 'subOrders', 'id'
    ])
    let fromTime = order.from_time
    let dealOrder = {
        ...originData,
        fromTime: fromTime && `${moment(fromTime).format("YYYY-MM-DD")} ${moment(fromTime).format('dddd')}`,
        fromStation: `${order.start_station_name} ${moment(fromTime).format("hh:mm")}`,
        toStation: `${order.arrive_station_name} ${moment(order.arrive_time).format("hh:mm")}`
    }
    ctx.body = dealOrder
}