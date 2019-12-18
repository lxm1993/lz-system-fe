const dbUtils = require('../../db')
const moment = require('moment');
const { getTicketTypes } = require('./base-mapping')
const agentTable = 'agent_info_table'
const agent = {
    // 获取平台列表
    async getAgents({ pageNum, pageSize, agentName = '' }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = agentName ? `WHERE agent_name LIKE '%${agentName}%'` : ''
            let sql = `SELECT * FROM ${agentTable} 
            ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${agentTable} ${wherePartSql}`
            console.log('getAgents:', sql)
            console.log('getAgents sumSql:', sumSql)

            let agentList = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']

            let ticketMap = {}
            if (total > 0) {
                ticketMap = await getTicketTypes(true)
            }
            return {
                rows: (agentList || []).map(agent => {
                    let serviceTypeIds = agent.service_type_ids.split(',').map(id => { return parseInt(id) })
                    let serviceTypeIdsStr = serviceTypeIds.map(id => {
                        return ticketMap[id]
                    }).join(',')
                    return {
                        id: agent.id,
                        agentName: agent.agent_name,
                        tel: agent.tel,
                        address: agent.address,
                        manager: agent.manager,
                        online: agent.online,
                        onlineStr: agent.online === 1 ? '启用' : '禁用',
                        serviceTypeIds: serviceTypeIds,
                        serviceTypeIdsStr: serviceTypeIdsStr,
                        serviceTimeStr: agent.service_time,
                        serviceTime: agent.service_time.split('~'),
                        alipayAccount: agent.alipay_account,
                        bankNumber: agent.bank_number,
                        bankName: agent.bank_name,
                        company: agent.company,
                    }
                }),
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新平台
    async saveAgent(agent, id = '') {
        try {
            let {
                agentName,
                serviceTime,
                online = 1,
                tel = '',
                address = '',
                manager = '',
                serviceTypeIds = '',
                alipayAccount = '',
                bankNumber = '',
                bankName = '',
                company = '',
            } = agent
            // serviceTime 传过来的是数组形式[12:15,13:15]
            serviceTime = serviceTime.join('~')
            serviceTypeIds = serviceTypeIds.join(',')
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                // let insertSql = `INSERT INTO ${agentTable} 
                // (agent_name, service_time, online, tel, address, manager, 
                // service_type_ids, alipay_account, bank_number, bank_name, company, gmt_create)
                // SELECT '${agentName}', '${serviceTime}', ${online}, '${tel}', '${address}', '${manager}',
                // '${serviceTypeIds}', '${alipayAccount}', '${bankNumber}', '${bankName}', '${company}','${curTime}'
                // FROM DUAL
                // WHERE NOT EXISTS
                // (SELECT agent_name FROM ${agentTable} WHERE agent_name = '${agentName}');`
                let insertSql = `INSERT INTO ${agentTable}
                (agent_name, service_time, online, tel, address, manager, 
                service_type_ids, alipay_account, bank_number, bank_name, company, gmt_create)
                VALUES 
                ('${agentName}', '${serviceTime}', ${online}, '${tel}', '${address}', '${manager}', 
                '${serviceTypeIds}', '${alipayAccount}', '${bankNumber}', '${bankName}', '${company}', '${curTime}')
                `
                console.log('saveAgent:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let updateSql = `UPDATE ${agentTable} 
                SET 
                    agent_name = '${agentName}',
                    service_time = '${serviceTime}',
                    online = ${online},
                    tel = '${tel}',
                    address = '${address}',
                    manager = '${manager}',
                    service_type_ids = '${serviceTypeIds}',
                    alipay_account = '${alipayAccount}',
                    bank_number = '${bankNumber}',
                    bank_name = '${bankName}',
                    company = '${company}',
                    gmt_modify = '${curTime}'
                WHERE
                    id = ${id};`
                console.log('updateAgent:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            let message = error.message.includes('ER_DUP_ENTRY') ?
                '商家已存在' : error.message
            throw new Error(message);
        }
    },
    // 删除平台
    async deleteAgent(id) {
        try {
            let deleteSql = `DELETE FROM ${agentTable} WHERE id = ${id}`
            console.log(`deleteAgent: `, deleteSql)
            let data = await dbUtils.query(deleteSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    },
}

module.exports = agent