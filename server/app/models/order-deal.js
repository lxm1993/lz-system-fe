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

const generateOrderId = (type = 'main') => {
    let r1 = Math.floor(Math.random() * 10);
    let r2 = Math.floor(Math.random() * 10);
    let curTime = moment().format("YYYYMMDDHHmmss")
    return `${type === 'main'? 'A': 'B'}${r1}${curTime}${r2}`
}
const systemFee = (commisionConfig, fee, time) => {
    let currentRate = 100
    let configs = commisionConfig.split(',')
    let current = parseInt(time.slice(-2)) > 0 ?
        `${time.slice(11,14)}${ parseInt(time.slice(14,18)) + 1}` : time.slice(11, 16)
    let timeIsOneDay = (times) => {
        let time1 = times[0].split(':')
        let time2 = times[1].split(':')
        let hour1 = time1[0]
        let minute1 = time1[1]
        let hour2 = time2[0]
        let minute2 = time2[1]
        if (hour1 < hour2) {
            return true
        } else if (hour1 === hour2) {
            if (minute1 < minute2) {
                return true
            } else if (minute1 === minute2) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    configs.forEach(config => {
        let timeFee = config.split('_')
        let fee = timeFee[1]
        let times = timeFee[0].split('~')
        let isOneDay = timeIsOneDay(times)
        if (isOneDay) {
            let isbetween = isBetweenTime(times[0], times[1], current)
            currentRate = isbetween ? fee : currentRate
        } else {
            let isbetween = isBetweenTime(times[0], '24:00', current) ||
                isBetweenTime('00:00', times[1], current)
            currentRate = isbetween ? fee : currentRate
        }
    })
    return (fee * currentRate) / 100
}
// let system_commision = systemFee(order.commisionConfig,
//     order.service_fee, formateTime(order.gmt_create))

const orderDeal = {}
module.exports = orderDeal