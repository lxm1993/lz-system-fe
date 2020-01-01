const dbUtils = require('../../db')
const moment = require('moment');
const mainOrderTable = 'main_order_table'
const subOrderTable = 'sub_order_table'
const agentTable = 'agent_info_table'

const gmtStr = `date_format(main.gmt_create, '%Y-%m-%d')`
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
                wherePartSqls.push(`main.agent_id = ${value}`)
                break;
            case 'payStatus':
                let sql = parseInt(value) === 1 ? 'main.pay_time is true' : 'main.pay_time is null'
                wherePartSqls.push(sql)
                break;
            default:
                break;
        }
    })
    if (wherePartSqls.length > 0) {
        wherePartSql = `WHERE ${wherePartSqls.join(' AND ')}`
    }
    let today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let statusStr = `main.status = 2 
    AND main.gmt_create < '${today}'`
    wherePartSql = wherePartSql ?
        `${wherePartSql} AND ${statusStr}` :
        `WHERE ${statusStr}`

    return wherePartSql
}
const orderBaseSql = `SELECT ${gmtStr} as date, main.pay_time, main.status,
    main.agent_id as agentId,
    SUM(sub.real_ticket_price) as payMoneys,
    agent.agent_name as agentName
    FROM ${mainOrderTable} main
    LEFT JOIN ${subOrderTable} sub on main.id = sub.order_id
    LEFT JOIN ${agentTable} agent ON main.agent_id = agent.id`
const pay = {
    async getPayOrders({ pageNum, pageSize, ...queryObj }) {
        try {
            let wherePartSql = getWhereSql(queryObj)
            let start = (pageNum - 1) * pageSize
            let baseSql = `${orderBaseSql} ${wherePartSql}
            GROUP BY ${gmtStr}, agent.agent_name
            ORDER BY main.gmt_create DESC `
            let sql = `${baseSql} LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM (${baseSql}) a `
            console.log(sql)
            let orders = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']
            return {
                rows: orders.map(order => {
                    return {
                        ...order,
                        isPay: !!order.pay_time,
                    }
                }),
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    async changeOderPayStatus(date, agentId) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let updateSql = `UPDATE ${mainOrderTable} 
                SET 
                    pay_time = '${curTime}',
                    gmt_modify = '${curTime}'
                WHERE
                    date_format(gmt_create, '%Y-%m-%d') = '${date}'
                    AND agent_id = ${agentId} `
            console.log(updateSql)
            let data = await dbUtils.query(updateSql)
            return data.affectedRows

        } catch (error) {
            throw new Error(error.message);
        }
    },
}

module.exports = pay