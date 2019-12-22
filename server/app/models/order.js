const dbUtils = require('../../db')
const moment = require('moment');
const { getDiffTime } = require('../utils/index')
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
    console.log(queryObj)
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
    async getOrdersWeek({ pageNum, pageSize, date, agentId }) {
        let start = (pageNum - 1) * pageSize
        let createDate = JSON.parse(date)
        let dateStr = "date_format(gmt_create, '%Y-%m-%d')"
        let baseSql = `SELECT ${dateStr} as date, COUNT(*) AS total,
        SUM(status=1) as deal,SUM(status=2) as success,SUM(status=3) as faild
        FROM ${mainOrderTable} 
        WHERE ${dateStr} BETWEEN '${createDate[0]}' AND '${createDate[1]}' ${agentId ? `AND agent_id = ${agentId}` : ''}
        GROUP BY gmt_create`
        let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
        let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `

        console.log('getOrdersWeek:', sql)
        let orders = await dbUtils.query(sql)
        let totals = await dbUtils.query(sumSql)
        let total = totals && totals[0]['COUNT(*)']

        return {
            rows: (orders || []).map(item => {
                let rate = item.success / (item.success + item.faild)
                return {
                    ...item,
                    successRate: rate ? `${rate * 100}%` : 0
                }
            }),
            total: total
        }
    },
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
                        orderStatusStr: orderStatusMap[order.status],
                        payStatusStr: payStatusMap[order.is_pay],
                        receiptStr: receiptMap[order.is_receipt],
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
    async getUnDealOrders(id) {
        let sql = `SELECT id, status FROM ${mainOrderTable} WHERE agent_id = ${id}`
        let orders = await dbUtils.query(sql)
        return orders.filter(item => {
            return item.status === 1
        }).map(item => { return item.id })
    },
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
                subOrders
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async dealOrder(orderId, status, subOrders = []) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let updateMainOrderSql = `UPDATE ${mainOrderTable} 
                SET status = ${status}, gmt_modify = '${curTime}'
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
}
module.exports = order