/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const orderModel = require('../models/order')
const homeModel = require('../models/home')
const { exportExcel } = require('../utils/export-util')
const moment = require('moment')
moment.locale('zh-cn')

//admin 首页统计列表
exports.getOrdersWeek = async function(ctx) {
    ctx.body = await homeModel.getOrdersWeek(ctx.query)
}
//admin 首页统计
exports.sumOrder = async function(ctx) {
    ctx.body = await homeModel.sumOrder()
}


//admin 订单列表
exports.getOrders = async function(ctx) {
    ctx.body = await orderModel.getOrders(ctx.query)
}
//admin 单个订单信息
exports.getOrder = async function(ctx) {
    const { id } = ctx.params
    if (!id) {
        throw new Error('订单id不存在')
    }
    ctx.body = await orderModel.getOrder(id)
}
//admin 订单处理失败
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
//admin 出发票
exports.changeOrderReceiptStatus = async function(ctx) {
    const { id } = ctx.params
    if (!id) {
        throw new Error('订单id不存在')
    }
    let operator = ctx.user.accountName
    let effectRows = await orderModel.changeOrderReceiptStatus(id, operator)
    if (effectRows === 0) {
        throw new Error('更新失败')
    }
    ctx.body = { message: '更新成功' }
}

// 导出
exports.ordersWeekExport = async function(ctx) {
    let data = await homeModel.getOrdersWeek(ctx.query)
    let headers = ['日期', '全部', '待出票', '出票成功', '出票失败', '出票成功率', '成功耗时(s)', '结算金额']
    let colums = ['date', 'total', 'deal', 'success', 'faild', 'successRate', 'successTime', 'payMoneys']
    ctx.body = await exportExcel({ data, headers, colums, name: 'agent-total' })
}
exports.ordersExport = async function(ctx) {
    let data = await orderModel.getOrders(ctx.query)
    let headers = [
        '订单ID', '平台', '售票点', '联系电话', '始发站', '终点站', '车票数量', '价格',
        '创建时间', '操作人', '发车时间', '发票状态', '订单状态'
    ]
    let colums = [
        'id', 'plat_name', 'agent_name', 'contacts_telephone', 'start_station_name', 'arrive_station_name',
        'ticket_count', 'total_price', 'gmt_create', 'operator', 'from_time', 'receiptStatusStr', 'orderStatusStr'
    ]
    ctx.body = await exportExcel({ data, headers, colums, name: 'order-list' })
}