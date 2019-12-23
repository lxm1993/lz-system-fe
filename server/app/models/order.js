const dbUtils = require('../../db')
const moment = require('moment');
const { getDiffTime, formateTime } = require('../utils/index')
const mainOrderTable = 'main_order_table'
const subOrderTable = 'sub_order_table'
const agentTable = 'agent_info_table'
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'
const ticketCommissoinTable = 'plat_fee_table'
moment.locale('zh-cn')

const generateOrderId = (type = 'main') => {
    let r1 = Math.floor(Math.random() * 10);
    let r2 = Math.floor(Math.random() * 10);
    let curTime = moment().format("YYYYMMDDHHmmss")
    return `${type === 'main'? 'A': 'B'}${r1}${curTime}${r2}`
}
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
    group_concat(sub.passenger_name) as passenger_names,
    group_concat(sub.cert_no) as cert_nos,
    plat.plat_name, ticketType.name as tickettype_name, agent.agent_name,
    commision.commision, commision.percent as commisionPercent
    FROM ${mainOrderTable} main
    LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
    LEFT JOIN ${platTable} plat ON main.plat_id = plat.id
    LEFT JOIN ${ticketTypeTable} ticketType ON main.ticket_type_id = ticketType.id
    LEFT JOIN ${agentTable} agent ON main.agent_id = agent.id
    LEFT JOIN ${ticketCommissoinTable} commision ON main.plat_id = commision.plat_id
    AND main.ticket_type_id = commision.ticket_type_id`

const orderStatusMap = { 1: '待处理', 2: '出票成功', 3: '出票失败' }
const payStatusMap = { 0: '未打款', 1: '已打款' }
const receiptMap = { 0: '不开发票', 1: '开发票' }

const order = {
    // 获取一周订单信息
    async getOrdersWeek({ pageNum, pageSize, date, agentId }) {
        try {
            let start = (pageNum - 1) * pageSize
            let createDate = JSON.parse(date)
            let dateStr = "date_format(gmt_create, '%Y-%m-%d')"
            let subDateStr = "date_format(main.gmt_create, '%Y-%m-%d')"

            let baseSql = `SELECT ${dateStr} as date, COUNT(1) AS total,
            SUM(status = 1) as deal, SUM(status = 2) as success, SUM(status = 3) as faild
            FROM ${mainOrderTable}
            WHERE ${dateStr} BETWEEN '${createDate[0]}' AND '${createDate[1]}' ${agentId ? `AND agent_id = ${agentId}` : ''}
            GROUP BY ${dateStr}`

            let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `
            let subPaySql = `SELECT  main.id ,${subDateStr} as date,
            group_concat(sub.real_ticket_price) as payMoneys
            FROM ${mainOrderTable} main
            JOIN ${subOrderTable} sub on main.id = sub.order_id
            WHERE ${subDateStr} BETWEEN '${createDate[0]}' AND '${createDate[1]}'
            AND main.is_pay = 1`
            // console.log('getOrdersWeek:', sql)

            let orders = await dbUtils.query(sql)
            let subOrders = await dbUtils.query(subPaySql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']

            let dateOrderMap = {}
            orders.forEach(order => {
                dateOrderMap[order.date] = { ...order, payMoneys: 0 }
            })
            subOrders.forEach(subOrder => {
                let payMoneys = subOrder.payMoneys ? subOrder.payMoneys.split(',') : ''
                let totalMoney = payMoneys ?
                    payMoneys.reduce(function(prev, next) {
                        return parseFloat(prev) + parseFloat(next);
                    }) : 0
                if (dateOrderMap[subOrder.date]) {
                    dateOrderMap[subOrder.date].payMoneys += parseFloat(totalMoney)
                }
            })
            return {
                rows: Object.values(dateOrderMap).map(item => {
                    let rate = item.success / (item.success + item.faild)
                    return {
                        ...item,
                        successRate: rate ? `${rate * 100}%` : 0
                    }
                }),
                total: total
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取订单列表
    async getOrders({ pageNum, pageSize, ...queryObj }) {
        try {
            let wherePartSql = getWhereSql(queryObj)
            let start = (pageNum - 1) * pageSize
            let baseSql = `${orderBaseSql} ${wherePartSql}
            GROUP BY main.id
            ORDER BY gmt_create DESC`
            let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `
            console.log('getOrders:', sql)
            //console.log('getOrders sumSql:', sumSql)
            let orders = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']

            return {
                rows: (orders || []).map(order => {
                    let passengerNames = order.passenger_names && order.passenger_names.split(',')
                    let passengerCettNos = order.cert_nos && order.cert_nos.split(',')
                    let passengers = passengerNames.map((name, index) => {
                        return `${name}: ${passengerCettNos[index]}`
                    })
                    let system_commision = (order.commision * order.commisionPercent) / 100
                    return {
                        ...order,
                        orderStatusStr: orderStatusMap[order.status || 0],
                        payStatusStr: payStatusMap[order.is_pay || 0],
                        receiptStr: receiptMap[order.is_receipt || 0],
                        passengers: passengers,
                        system_commision: system_commision,
                        plat_commision: order.commision - system_commision
                    }
                }),
                total: total
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取单个订单信息
    async getOrder(id) {
        try {
            let mainOrderSql = `${orderBaseSql} WHERE main.id = ${id}`
            let subOrderSql = `SELECT * FROM ${subOrderTable} WHERE order_id = ${id}`
            let orders = await dbUtils.query(mainOrderSql)
            let subOrders = await dbUtils.query(subOrderSql)
            let order = orders && orders[0]
            return {
                ...order,
                orderStatusStr: orderStatusMap[order.status],
                payStatusStr: payStatusMap[order.is_pay],
                receiptStr: receiptMap[order.is_receipt],
                seatRequirement: `指定${order.under_count}个下铺`,
                isChangeStr: order.is_change === 1 ? '接受' : '不接受',
                tranDiffTime: getDiffTime(order.arrive_time, order.from_time),
                gmt_create: formateTime(order.gmt_create),
                gmt_modify: formateTime(order.gmt_modify),
                arrive_time: formateTime(order.arrive_time),
                from_time: formateTime(order.from_time),
                subOrders
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取未结算订单列表
    async getUnDealOrders(id) {
        let sql = `SELECT id, status FROM ${mainOrderTable} WHERE agent_id = ${id}`
        let orders = await dbUtils.query(sql)
        return orders.filter(item => {
            return item.status === 1
        }).map(item => { return item.id })
    },
    // 处理订单
    async dealOrder(data) {
        let { orderId, status, subOrders = [], operator } = data
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let updateMainOrderSql = `UPDATE ${mainOrderTable} 
                SET status = ${status}, gmt_modify = '${curTime}',operator = '${operator}'
                WHERE id = ${orderId};`
            let updateSubOrderPromises = subOrders.map(order => {
                let sql = `UPDATE ${subOrderTable} 
            SET coach_no = ${order.coach_no},
                real_seat_type = ${order.real_seat_type},
                seat_no = ${order.seat_no},
                real_ticket_price = ${order.real_ticket_price},
                gmt_modify = '${curTime}'
            WHERE sub_order_id = ${order.sub_order_id};`
                return dbUtils.query(sql)
            })
            await Promise.all(updateSubOrderPromises)
            let data = await dbUtils.query(updateMainOrderSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // admin订单统计
    async sumOrder() {
        try {
            let yesterday = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
            let sumsql = `SELECT SUM(status = 1) as unDeal, SUM(is_pay = 0) as unPay
            FROM ${mainOrderTable}`
            let incomeSql = `select main.id, group_concat(sub.real_ticket_price) as pays
            from ${mainOrderTable} main
            LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
            WHERE main.is_pay = 1 AND date_format(main.gmt_create, '%Y-%m-%d') = '${yesterday}'
            GROUP BY main.id`
            console.log('sumOrder', sumsql)
            console.log('sumOrder', incomeSql)

            let sums = await dbUtils.query(sumsql)
            let subOrders = await dbUtils.query(incomeSql)

            let sum = sums && sums[0]
            let income = 0
            subOrders.forEach(item => {
                let pays = item.pays ? item.pays.split(',') : ''
                let payMoney = pays ?
                    pays.reduce(function(prev, next) {
                        return parseFloat(prev) + parseFloat(next);
                    }) : 0
                income += parseFloat(payMoney)
            })

            return { ...sum, income: income }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 代售点订单统计
    async sumAgentOrder(agentId) {
        try {
            let sumsql = `SELECT SUM(status = 1) as unDeal, SUM(is_pay = 0) as unPay
            FROM ${mainOrderTable} WHERE agent_id = ${agentId}`

            let unPaySql = `select main.id, group_concat(sub.real_ticket_price) as unPays
            from ${mainOrderTable} main
            LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
            WHERE main.agent_id = ${agentId} AND main.status = 2 AND main.is_pay = 0
            GROUP BY main.id`
            console.log('sumOrder', sumsql)

            let sums = await dbUtils.query(sumsql)
            let subOrders = await dbUtils.query(unPaySql)

            let sum = sums && sums[0]
            let unpay = 0
            subOrders.forEach(item => {
                let unPays = item.unPays ? item.unPays.split(',') : ''
                let unpayMoney = unPays ?
                    unPays.reduce(function(prev, next) {
                        return parseFloat(prev) + parseFloat(next);
                    }) : 0
                unpay += parseFloat(unpayMoney)
            })
            return { ...sum, unpay: unpay }
        } catch (error) {
            throw new Error(error.message);
        }
    }

}
module.exports = order