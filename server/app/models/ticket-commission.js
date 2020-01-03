const dbUtils = require('../../db')
const moment = require('moment');
const ticketCommissoinTable = 'plat_fee_table'
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'

const ticketCommision = {
    // 获取分佣配置列表
    async getTicketCommissoins({ pageNum = 1, pageSize = 20 }) {
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
            let [ticketCommissoins, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: (ticketCommissoins || []).map(ticketCommissoin => {
                    let configStrs = []
                    let config = ticketCommissoin.config && ticketCommissoin.config.split(',').map(item => {
                        let map = item.split('_')
                        let time = map[0]
                        let count = map[1]
                        let configStr = `${time}: ${count}%`
                        configStrs.push(configStr)
                        return { append: time.split('~'), value: count }
                    })
                    return {
                        id: ticketCommissoin.id,
                        platId: ticketCommissoin.plat_id,
                        ticketTypeId: ticketCommissoin.ticket_type_id,
                        platName: ticketCommissoin.platName,
                        ticketTypeName: ticketCommissoin.ticketTypeName,
                        config: config,
                        configStr: configStrs.join(','),
                        online: ticketCommissoin.online,
                    }
                }),
                total: totals && totals[0]['COUNT(*)'] || 0
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新分佣配置
    async saveTicketCommission(ticketType, id = '') {
        id = parseInt(id)
        try {
            let { platId, ticketTypeId, config, online } = ticketType
            // serviceTime 传过来的是数组形式[12:15,13:15]
            let CommissoinConfig = config.map(item => {
                return `${item.append.join('~')}_${parseInt(item.value)}`
            }).join(',')
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${ticketCommissoinTable} 
                (plat_id, ticket_type_id, config, online, gmt_create)
                SELECT ${platId},${ticketTypeId},'${CommissoinConfig}',${online},'${curTime}'
                FROM DUAL
                WHERE NOT EXISTS
                (SELECT plat_id, ticket_type_id FROM ${ticketCommissoinTable} 
                    WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId});`
                // console.log('saveTicketCommission:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let testSql = `SELECT * FROM ${ticketCommissoinTable} 
                WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId}`
                let rows = await dbUtils.query(testSql)
                let oldId = rows && rows[0] && rows[0].id
                // 非修改
                if (oldId !== id && rows.length > 0) {
                    return 0
                }
                let updateSql = `UPDATE ${ticketCommissoinTable} 
                SET 
                    plat_id = '${platId}',
                    ticket_type_id = '${ticketTypeId}',
                    config = '${CommissoinConfig}',
                    online = ${online},
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
}

module.exports = ticketCommision