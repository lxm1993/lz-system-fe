const dbUtils = require('../../db')
const moment = require('moment')
const { getAgents } = require('./base-mapping')
const ticketAssignTable = 'order_map_table'
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'


const ticketAssign = {
    // 获取票务类型列表
    async getTicketAssigns({ pageNum = 1, pageSize = 20, platName = '' }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = platName ? `WHERE plat_name LIKE '%${platName}%'` : ''
            let sql = `SELECT assign.*, 
            plat.plat_name as platName, ticketType.name as ticketTypeName
            FROM ${ticketAssignTable} assign
            LEFT JOIN ${platTable} plat ON assign.plat_id = plat.id
            LEFT JOIN ${ticketTypeTable} ticketType ON assign.ticket_type_id = ticketType.id ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${ticketAssignTable} ${wherePartSql}`
            //console.log('getTicketAssigns:', sql)
            //console.log('getTicketAssigns sumSql:', sumSql)

            let [ticketAssigns, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])

            let total = totals && totals[0]['COUNT(*)'] || 0
            let agentMap = {}
            if (total > 0) {
                agentMap = await getAgents(true)
            }
            return {
                rows: (ticketAssigns || []).map(ticketAssign => {
                    let configStrs = []
                    let config = ticketAssign.config && ticketAssign.config.split(',').map(item => {
                        let map = item.split(':')
                        let agentId = map[0]
                        let count = map[1]
                        if (!agentMap[agentId]) {
                            return {}
                        }
                        let configStr = `${agentMap[agentId]}: ${count}`
                        configStrs.push(configStr)
                        return { append: parseInt(agentId), value: count }
                    })

                    return {
                        id: ticketAssign.id,
                        platId: ticketAssign.plat_id,
                        ticketTypeId: ticketAssign.ticket_type_id,
                        platName: ticketAssign.platName,
                        ticketTypeName: ticketAssign.ticketTypeName,
                        online: ticketAssign.online,
                        config: config,
                        configStr: configStrs.join(','),
                    }
                }),
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新票务类型
    async saveTicketAssign(ticketType, id = '') {
        id = parseInt(id)
        try {
            let { platId, ticketTypeId, config, online } = ticketType
            let agentAssignsConfig = config.map(item => {
                return `${item.append}:${parseInt(item.value)}`
            }).join(',')
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${ticketAssignTable} 
                (plat_id, ticket_type_id, config, online, gmt_create)
                SELECT ${platId},${ticketTypeId},'${agentAssignsConfig}',${online},'${curTime}'
                FROM DUAL
                WHERE NOT EXISTS
                (SELECT * FROM ${ticketAssignTable} 
                    WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId});`
                //console.log('saveTicketAssign:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let testSql = `SELECT * FROM ${ticketAssignTable} 
                WHERE plat_id = ${platId} AND ticket_type_id = ${ticketTypeId}`
                let rows = await dbUtils.query(testSql)
                let oldId = rows && rows[0] && rows[0].id
                // 非修改
                if (oldId !== id && rows.length > 0) {
                    return 0
                }
                let updateSql = `UPDATE ${ticketAssignTable} 
                SET 
                    plat_id = '${platId}',
                    ticket_type_id = '${ticketTypeId}',
                    config = '${agentAssignsConfig}',
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

module.exports = ticketAssign