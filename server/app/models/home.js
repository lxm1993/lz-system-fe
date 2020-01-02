const dbUtils = require('../../db')
const moment = require('moment');
const mainOrderTable = 'main_order_table'
const subOrderTable = 'sub_order_table'
const agentTable = 'agent_info_table'
const platTable = 'plat_info_table'
moment.locale('zh-cn')

const gmtStr = "date_format(main.gmt_create, '%Y-%m-%d')"
const getWhereSql = (queryObj) => {
    let wherePartSql = ''
    let wherePartSqls = []
    Object.keys(queryObj).forEach(key => {
        let value = queryObj[key]
        switch (key) {
            case 'gmt_create':
                let createDate = JSON.parse(value)
                wherePartSqls.push(`${gmtStr} 
                BETWEEN '${createDate[0]}' AND '${createDate[1]}'`)
                break;
            case 'agent_id':
            case 'plat_id':
                wherePartSqls.push(`main.${key} = ${value}`)
                break;
            default:
                break;
        }
    })
    if (wherePartSqls.length > 0) {
        wherePartSql = `WHERE ${wherePartSqls.join(' AND ')}`
    }
    return wherePartSql
}
const home = {
    // 获取一周订单信息
    async getOrdersWeek({ pageNum, pageSize, ...queryObj }) {
        try {
            let start = (pageNum - 1) * pageSize
            let baseSql = `SELECT ${gmtStr} as date, COUNT(1) AS total,
            ${queryObj.plat_id ? 'plat.plat_name,' : ''}  ${queryObj.agent_id ? 'agent.agent_name,' : ''}
            SUM(main.status = 1) as deal, SUM(main.status = 2) as success, SUM(main.status = 3) as faild,
            SUM(IF(main.status = 2, unix_timestamp(main.close_time), 0)) as closeTimes,
            SUM(IF(main.status = 2, unix_timestamp(main.gmt_create), 0)) as createTimes
            FROM ${mainOrderTable} main
            LEFT JOIN ${platTable} plat ON main.plat_id = plat.id
            LEFT JOIN ${agentTable} agent ON main.agent_id = agent.id
            ${getWhereSql(queryObj)}
            GROUP BY ${gmtStr}`

            let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `

            let subWhereSql = getWhereSql(queryObj)
            let subPaySql = `SELECT main.id ,${gmtStr} as date,
            SUM(sub.real_ticket_price) as payMoneys
            FROM ${mainOrderTable} main
            JOIN ${subOrderTable} sub on main.id = sub.order_id ${subWhereSql}
            ${subWhereSql ? 'AND main.pay_time is true' : 'WHERE main.pay_time is true'}
            GROUP BY ${gmtStr}`

            let [orders, subOrders, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(subPaySql),
                await dbUtils.query(sumSql)
            ])
            let sumOrders = orders.map(order => {
                let payMoneys = 0
                let successRate = 0
                let successTime = 0
                subOrders.forEach(subOrder => {
                    if (subOrder.date === order.date) {
                        payMoneys = subOrder.payMoneys || 0
                    }
                })
                if (order.success + order.faild > 0 && order.success) {
                    successRate = `${(order.success / (order.success + order.faild)* 100).toFixed(2)}%`
                }
                if (order.success) {
                    successTime = ((order.closeTimes - order.createTimes) / order.success).toFixed(2)
                }
                return { ...order, payMoneys, successRate, successTime }
            })
            return {
                rows: sumOrders,
                total: totals && totals[0]['COUNT(*)']
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // admin订单统计
    async sumOrder() {
        try {
            let yesterday = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')
            let unDealSql = `SELECT count(1) as total FROM ${mainOrderTable} where status = 1`
            let incomeSql = `SELECT main.id,
            SUM(sub.real_ticket_price) as income, main.system_service_fee * count(sub.order_id is true) as serviceFee
            from ${mainOrderTable} main
            LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
            WHERE main.status = 2 AND date_format(main.gmt_create, '%Y-%m-%d')='${yesterday}'
            GROUP BY main.id`
            let [unDeal, subOrders] = await Promise.all([
                await dbUtils.query(unDealSql),
                await dbUtils.query(incomeSql)
            ])
            let incomeSum = 0
            let serviceFeeSum = 0
            subOrders.forEach(item => {
                incomeSum += +item.income
                serviceFeeSum += +item.serviceFee
            })
            return {
                unDeal: unDeal && unDeal[0].total || 0,
                incomeSum,
                serviceFeeSum
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 代售点订单统计
    async sumAgentOrder(agentId) {
        try {
            let unPayOrDealSql = `SELECT 
            SUM(pay_time is null) as unPay,SUM(status = 1) as unDeal
            FROM ${mainOrderTable} 
            WHERE agent_id = ${agentId}`

            let unPayMoneySql = `select SUM(sub.real_ticket_price) as unPayMoney
            from ${mainOrderTable} main
            LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
            WHERE main.agent_id = ${agentId} AND main.status = 2 AND main.pay_time is null`

            let [unPayOrDeal, unPayMoney] = await Promise.all([
                await dbUtils.query(unPayOrDealSql),
                await dbUtils.query(unPayMoneySql),
            ])
            unPayOrDeal = unPayOrDeal && unPayOrDeal[0]
            return {
                unPay: unPayOrDeal.unPay || 0,
                unDeal: unPayOrDeal.unDeal || 0,
                unpay: unPayMoney && unPayMoney[0].unPayMoney || 0,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

}
module.exports = home