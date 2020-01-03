/**
 * 代售点订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order')
const homeModel = require('../models/home')
const { exportExcel } = require('../utils/export-util')
const moment = require('moment')
moment.locale('zh-cn')

//agent 首页统计列表
exports.getAgentOrdersWeek = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    ctx.body = await homeModel.getOrdersWeek(query)
}
//agent 首页统计
exports.sumAgentOrder = async function(ctx) {
    ctx.body = await homeModel.sumAgentOrder(ctx.user.agentId)
}

//agent 订单列表
exports.getAgentOrders = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    let data = await orderModel.getOrders(query)
    ctx.body = data
}
//agent 单个订单信息
exports.getAgentOrder = async function(ctx) {
    const { id } = ctx.params
    if (!id) {
        throw new Error('订单id不存在')
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
//agent 获取所有未处理订单
exports.getUnDealOrders = async function(ctx) {
    ctx.body = await orderModel.getUnDealOrders(ctx.user.agentId)
}
//agent 出票失败
exports.dealOrderFailed = async function(ctx) {
    const { id } = ctx.params
    if (!id) {
        throw new Error('订单id不存在')
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.dealOrderFailed(id, operator)
    if (effectRows === 0) {
        throw new Error('更新失败')
    }
    ctx.body = { message: '更新成功' }
}
//agent 出票成功
exports.dealOrderSuccess = async function(ctx) {
    const { id } = ctx.params
    const subOders = ctx.request.body || []
    if (!id) {
        throw new Error('订单id不存在')
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.dealOrderSuccess(id, operator, subOders)
    if (effectRows === 0) {
        throw new Error('更新失败')
    }
    ctx.body = { message: '更新成功' }
}
// 获取详细坐席（坐席描述）
exports.getSubSeats = async function(ctx) {
    const { type } = ctx.params
    ctx.body = { data: await orderModel.getSubSeats(type) }
}

// 导出
exports.agentOrdersWeekExport = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    let data = await homeModel.getOrdersWeek(query)
    let headers = ['日期', '全部', '待出票', '出票成功', '出票失败', '出票成功率', '结算金额']
    let colums = ['date', 'total', 'deal', 'success', 'faild', 'successRate', 'payMoneys']
    ctx.body = await exportExcel({ data, headers, colums, name: 'agent-total' })
}
exports.agentOrdersExport = async function(ctx) {
    let query = {
        ...ctx.query,
        agent_id: ctx.user.agentId,
    }
    let data = await orderModel.getOrders(query)
    let headers = [
        '订单ID', '联系电话', '始发站', '终点站', '车票数量',
        '创建时间', '完成时间', '操作人', '订单状态'
    ]
    let colums = [
        'id', 'contacts_telephone', 'start_station_name', 'arrive_station_name',
        'ticket_count', 'gmt_create', 'close_time', 'operator', 'orderStatusStr'
    ]
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}