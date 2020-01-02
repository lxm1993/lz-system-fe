const dbUtils = require('../../db')
const moment = require('moment');
const { getDiffTime, formateTime, isBetweenTime } = require('../utils/index')
const mainOrderTable = 'main_order_table'
const subOrderTable = 'sub_order_table'
const agentTable = 'agent_info_table'
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'
const ticketCommissoinTable = 'plat_fee_table'
moment.locale('zh-cn')

const getWhereSql = (queryObj) => {
    let wherePartSql = ''
    let wherePartSqls = []
    Object.keys(queryObj).forEach(key => {
        let value = queryObj[key]
        switch (key) {
            case 'gmt_create':
                let createDate = JSON.parse(value)
                wherePartSqls.push(`date_format(main.gmt_create, '%Y-%m-%d') 
                BETWEEN '${createDate[0]}' AND '${createDate[1]}'`)
                break;
            case 'passenger_name':
                wherePartSqls.push(`sub.passenger_name LIKE '%${value}%'`)
                break;
            default:
                let isInt = ['status', 'plat_id', 'agent_id'].includes(key)
                let query = isInt ? `main.${key} = ${value}` :
                    `main.${key} LIKE '%${value}%'`
                wherePartSqls.push(query)
                break;
        }
    })
    if (wherePartSqls.length > 0) {
        wherePartSql = `WHERE ${wherePartSqls.join(' AND ')}`
    }
    return wherePartSql
}

const orderBaseSql = `SELECT main.*,
    plat.plat_name, ticketType.name as tickettype_name, agent.agent_name,
    commision.config as commisionConfig
    FROM ${mainOrderTable} main
    LEFT JOIN ${platTable} plat ON main.plat_id = plat.id
    LEFT JOIN ${ticketTypeTable} ticketType ON main.ticket_type_id = ticketType.id
    LEFT JOIN ${agentTable} agent ON main.agent_id = agent.id
    LEFT JOIN ${ticketCommissoinTable} commision ON main.plat_id = commision.plat_id 
    AND main.ticket_type_id = commision.ticket_type_id`

const orderStatusMap = { 1: '待处理', 2: '出票成功', 3: '出票失败' }

const dealOrderCommon = (order) => {
    let receiptStatusStr = '不开发票'
    if (order.is_receipt === 1) {
        receiptStatusStr = order.receipt_time ? '已开' : '未开'
    }
    return {
        orderStatusStr: orderStatusMap[order.status || 0],
        payStatusStr: order.pay_time ? '已结算' : '未结算',
        receiptStatusStr: receiptStatusStr,
        gmt_create: formateTime(order.gmt_create),
        close_time: formateTime(order.close_time),
        pay_time: formateTime(order.pay_time),
        limit_time: formateTime(order.limit_time),
        arrive_time: formateTime(order.arrive_time),
        from_time: formateTime(order.from_time),
        receipt_time: formateTime(order.receipt_time),
    }
}
const order = {
    // 获取订单列表
    async getOrders({ pageNum = 1, pageSize = 20, ...queryObj }) {
        try {
            let wherePartSql = getWhereSql(queryObj)
            let start = (pageNum - 1) * pageSize
            let baseSql = `${orderBaseSql} ${wherePartSql}
            GROUP BY main.id
            ORDER BY gmt_create DESC`
            let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `

            let [orders, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: (orders || []).map(order => {
                    return { ...order, ...dealOrderCommon(order) }
                }),
                total: totals && totals[0]['COUNT(*)'] || 0
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // 获取单个订单信息
    async getOrder(id) {
        try {
            let mainOrderSql = `${orderBaseSql} WHERE main.id = ${id}`
            let subOrderSql = `SELECT * FROM ${subOrderTable} WHERE order_id = ${id}`
            let [orders, subOrders] = await Promise.all([
                await dbUtils.query(mainOrderSql),
                await dbUtils.query(subOrderSql)
            ])
            let order = orders && orders[0]
            subOrders = subOrders.map(subOrder => {
                return {
                    ...subOrder,
                    seatStr: subOrder.coach_no ?
                        `${subOrder.coach_no}车厢${subOrder.seat_no ? subOrder.seat_no + '号' : ''}` : ''
                }
            })
            return {
                ...order,
                ...dealOrderCommon(order),
                total_money: order.total_price + order.service_fee * order.ticket_count,
                seatRequirement: order.under_count != null ? `指定${order.under_count}个下铺` : 0,
                changeStr: order.is_change ? '接收' : '不接受',
                tranDiffTime: getDiffTime(order.arrive_time, order.from_time),
                subOrders
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // 获取未结算订单列表
    async getUnDealOrders(id) {
        try {
            let sql = `SELECT id FROM ${mainOrderTable} 
        WHERE agent_id = ${id} AND status = 1`
            let orders = await dbUtils.query(sql)
            let orderIds = (orders || []).map(item => {
                return item.id
            })
            return orderIds
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // 处理订单失败
    async dealOrderFailed(id, operator) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let updateMainOrderSql = `UPDATE ${mainOrderTable} 
            SET status = 3, gmt_modify = '${curTime}', close_time = '${curTime}',operator = '${operator}'
            WHERE id = ${id};`
            let updateSubOrderSql = `UPDATE ${subOrderTable} 
            SET gmt_modify = '${curTime}'
            WHERE order_id = ${id};`
            let [data, subOrders] = await Promise.all([
                await dbUtils.query(updateMainOrderSql),
                await dbUtils.query(updateSubOrderSql)
            ])
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // 处理订单成功
    async dealOrderSuccess(id, operator, subOders) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let updateMainOrderSql = `UPDATE ${mainOrderTable} 
            SET status = 2, gmt_modify = '${curTime}', close_time = '${curTime}',operator = '${operator}'
            WHERE id = ${id};`
            let subOrderProm = subOders.map(async order => {
                let sql = `UPDATE ${subOrderTable} 
                SET coach_no = '${order.coach_no}',
                    real_seat_type = '${order.real_seat_type}',
                    seat_no = '${order.seat_no}',
                    real_ticket_price = ${order.real_ticket_price},
                    gmt_modify = '${curTime}'
                WHERE sub_order_id = ${order.sub_order_id} AND order_id = ${id};`
                return await dbUtils.query(sql)
            })
            let subOrders = await Promise.all(subOrderProm)
            let data = await dbUtils.query(updateMainOrderSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // 开发票
    async changeOrderReceiptStatus(id, operator) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let sql = `UPDATE ${mainOrderTable} 
            SET gmt_modify = '${curTime}', receipt_time = '${curTime}', operator = '${operator}'
            WHERE id = ${id};`
            let data = await dbUtils.query(sql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async getSubSeats(type) {
        try {
            let sql = `SELECT attr FROM seat_info_table 
           WHERE name = '${type}'`
            let seats = await dbUtils.query(sql)
            let seatList = (seats && seats[0]).attr.split(',')
            if (seatList.length > 0) {
                seatList.push('其他')
            }
            return seatList
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
module.exports = order