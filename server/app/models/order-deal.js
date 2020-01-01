const dbUtils = require('../../db')
const moment = require('moment')
const _ = require('lodash')
const { isBetweenTime, weightRandom } = require('../utils/index')
const mainOrderTable = 'main_order_table'
const subOrderTable = 'sub_order_table'
const ticketCommissoinTable = 'plat_fee_table'
const ticketAssignTable = 'order_map_table'
const agentTable = 'agent_info_table'
const humpToLine = (name) => {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase()
}
const systemFee = (commisionConfig, fee, time) => {
    let currentRate = 100
    let curTime = moment().format("HH:mm")
    let configs = commisionConfig && commisionConfig.split(',')
    configs.forEach(config => {
        let timeFee = config && config.split('_')
        let fee = timeFee[1]
        let times = timeFee[0] && timeFee[0].split('~')
        let isBetween = isBetweenTime(times, curTime)
        currentRate = isBetween ? fee : currentRate
    })
    return (fee * currentRate) / 100
}
const generateOrderId = (type = 'main') => {
    let r1 = Math.floor(Math.random() * 10);
    let r2 = Math.floor(Math.random() * 10);
    let curTimeStamp = new Date().getTime()
    return parseInt(`${type === 'main'? '1': '2'}${r1}${curTimeStamp}${r2}`)
}
const mainIntParams = [
    'p_order_id', 'agent_id', 'plat_id', 'ticket_type_id',
    'ticket_count', 'is_change', 'under_count', 'is_receipt',
    'service_fee', 'plat_service_fee', 'system_service_fee',
    'id', 'status'
]
const subIntParams = [
    'sub_order_id', 'order_id', 'ticket_price', 'real_ticket_price'
]
const packageOderInsertSql = (order, intParams, table) => {
    let keys = []
    let values = []
    Object.keys(order).forEach(key => {
        let value = !intParams.includes(key) ? `'${order[key]}'` : parseInt(order[key])
        if (value) {
            keys.push(key)
            values.push(value)
        }
    })
    let sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`
    return sql
}
const orderDeal = {
    async createOrder(order) {
        try {
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            let commisionSql = `SELECT config FROM ${ticketCommissoinTable}
            WHERE plat_id = ${order.plat_id} AND ticket_type_id = ${order.ticket_type_id}`
            let commisionConfigs = await dbUtils.query(commisionSql)
            let commisionConfig = commisionConfigs && commisionConfigs[0] &&
                commisionConfigs[0].config
            if (commisionConfig) {
                let system_commision = systemFee(commisionConfig,
                    order.service_fee, curTime)
                order.system_service_fee = system_commision
                order.plat_service_fee = order.service_fee - system_commision
            }
            let mainOrderId = generateOrderId('main')
            let mainOrder = {
                ..._.omit(order, 'subOrders'),
                id: mainOrderId,
                status: 1, //待处理
                gmt_create: curTime,
            }
            let subOrderCommon = {
                order_id: mainOrderId,
                gmt_create: curTime,
                seat_type: order.seat_type,
            }
            let subOrderSqlPromises = order.subOrders.map(async subOrder => {
                let order = {
                    ...subOrder,
                    ...subOrderCommon,
                    sub_order_id: generateOrderId('sub'),
                }
                let sql = packageOderInsertSql(order, subIntParams, subOrderTable)
                return await dbUtils.query(sql)
            })
            let mainInsertSql = packageOderInsertSql(mainOrder, mainIntParams, mainOrderTable)
            let subOrders = await Promise.all(subOrderSqlPromises)
            let data = await dbUtils.query(mainInsertSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 批量新建
    async batchSaveOrders(orderList = []) {
        try {
            let getLineOrder = (object) => {
                let order = {}
                Object.keys(object).forEach(key => {
                    let lineKey = humpToLine(key)
                    if (key === 'subOrders') {
                        let subOrders = object[key] || []
                        order.subOrders = subOrders.map(subOrder => {
                            return getLineOrder(subOrder)
                        })
                    } else {
                        order[lineKey] = object[key]
                    }
                })
                return order
            }
            let getAgentWeightMap = async (oneOrder) => {
                let weightMap = {}
                let ticketAssignSql = `SELECT config FROM ${ticketAssignTable}
            WHERE plat_id = ${oneOrder.plat_id} 
            AND ticket_type_id = ${oneOrder.ticket_type_id}`
                let assignConfigs = await dbUtils.query(ticketAssignSql)
                let configStr = assignConfigs && assignConfigs[0] &&
                    assignConfigs[0].config
                if (!configStr) { return weightMap }
                //1:50,4:50 或者 4:50
                configStr.split(',').forEach(item => {
                    let one = (item && item.split(':')) || []
                    if (one[1]) {
                        weightMap[one[0]] = (+one[1]).toFixed(2)
                    }
                })
                return weightMap
            }
            let getOnLineAgentWeight = async (platAgentAssignMap) => {
                let curTime = moment().format("HH:mm")
                let agentIds = Object.keys(platAgentAssignMap)
                if (agentIds.length === 0) {
                    return []
                }
                let sql = `SELECT id, service_time FROM ${agentTable} 
            WHERE id in (${agentIds.join(',')}) AND online = 1`
                let agents = await dbUtils.query(sql)
                if (!agents || agents.length === 0) {
                    return []
                }
                let weightList = []
                agents.forEach(agent => {
                    if (agent.service_time) {
                        let allTimes = agent.service_time.split(',')
                        let isBetween = false
                        allTimes.forEach(timeRange => {
                            let times = timeRange.split('～')
                            if (!isBetween) {
                                isBetween = isBetweenTime(times, curTime)
                            }
                        })
                        if (isBetween) {
                            let map = {
                                agentId: agent.id,
                                weight: +platAgentAssignMap[agent.id]
                            }
                            weightList.push(map)
                        }
                    }
                })
                return weightList
            }
            let orders = orderList.map(order => {
                return getLineOrder(order)
            })
            let oneOrder = orders[0]
            let platAgentAssignMap = await getAgentWeightMap(oneOrder)
            let agentWeightList = await getOnLineAgentWeight(platAgentAssignMap)
            if (Object.keys(agentWeightList).length === 0) {
                throw new Error('无正在服务的代售点');
            }
            orders = orders.map(order => {
                let agent = weightRandom(agentWeightList)
                console.log(agent.agentId)
                return {
                    ...order,
                    agent_id: agent.agentId
                }
            })
            let promiseList = orders.map(async order => {
                return await this.createOrder(order)
            })
            let data = await Promise.all(promiseList)
            return data.length
        } catch (error) {
            throw new Error(error.message);
        }
    },

}
module.exports = orderDeal