const dbUtils = require('../../db')
const moment = require('moment');
const ticketCommissoinTable = 'plat_fee_table'
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'

const ticketCommision = {
    // 获取分佣配置列表
    async getTicketCommissoins({ pageNum, pageSize }) {
        try {
            let start = (pageNum - 1) * pageSize
            let sql = `SELECT commission.*, 
            plat.plat_name as platName, ticketType.name as ticketTypeName
            FROM ${ticketCommissoinTable} commission
            LEFT JOIN ${platTable} plat ON commission.plat_id = plat.id
            LEFT JOIN ${ticketTypeTable} ticketType ON commission.ticket_type_id = ticketType.id
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${ticketCommissoinTable}`
            //console.log('getTicketCommisions:', sql)
            //console.log('getTicketCommisions sumSql:', sumSql)
            let ticketCommissoins = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']
            return {
                rows: (ticketCommissoins || []).map(ticketCommissoin => {
                    return {
                        id: ticketCommissoin.id,
                        platId: ticketCommissoin.plat_id,
                        ticketTypeId: ticketCommissoin.ticket_type_id,
                        platName: ticketCommissoin.platName,
                        ticketTypeName: ticketCommissoin.ticketTypeName,
                        serviceTime: ticketCommissoin.service_time.split('~'),
                        serviceTimeStr: ticketCommissoin.service_time,
                        commision: ticketCommissoin.commision,
                        percent: ticketCommissoin.percent,
                        percentStr: `${ticketCommissoin.percent}%`,
                    }
                }),
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新分佣配置
    async saveTicketCommission(ticketType, id = '') {
        try {
            let { platId, ticketTypeId, serviceTime, commision, percent } = ticketType
            // serviceTime 传过来的是数组形式[12:15,13:15]
            serviceTime = serviceTime.join('~')
            commision = parseFloat(commision)
            percent = parseFloat(percent)
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${ticketCommissoinTable} 
                (plat_id, ticket_type_id, service_time, commision, percent, gmt_create)
                SELECT ${platId},${ticketTypeId},'${serviceTime}',${commision},${percent},'${curTime}'
                FROM DUAL
                WHERE NOT EXISTS
                (SELECT plat_id, ticket_type_id FROM ${ticketCommissoinTable} 
                    WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId});`
                //console.log('saveTicketCommission:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let testSql = `SELECT * FROM ${ticketCommissoinTable} 
                WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId}`
                let rows = await dbUtils.query(testSql)
                let oldId = rows && rows[0] && rows[0].id
                // 非修改名字并且存在用户名
                if (oldId !== id && rows.length > 0) {
                    return 0
                }
                let updateSql = `UPDATE ${ticketCommissoinTable} 
                SET 
                    plat_id = '${platId}',
                    ticket_type_id = '${ticketTypeId}',
                    service_time = '${serviceTime}',
                    commision = '${commision}',
                    percent = '${percent}',
                    gmt_modify = '${curTime}'
                WHERE
                    id = ${id};`
                //console.log('saveTicketCommission:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 删除分佣配置
    async deleteTicketCommission(id) {
        try {
            let deleteSql = `DELETE FROM ${ticketCommissoinTable} WHERE id = ${id}`
            //console.log(`deleteTicketCommission: `, deleteSql)
            let data = await dbUtils.query(deleteSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = ticketCommision