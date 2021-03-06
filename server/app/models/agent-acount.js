const dbUtils = require('../../db')
const moment = require('moment')
const { formateTime } = require('../utils/index')
const accountTable = 'account_table'
const agentTable = 'agent_info_table'

const agentAccount = {
    // 获取商家账户列表
    async getAgentAccounts({ pageNum = 1, pageSize = 20, agentId }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = agentId ? `WHERE agent_id = '${agentId}'` : ''
            let sql = `SELECT account.* , agent.agent_name as agentName
            FROM ${accountTable} account
            LEFT JOIN ${agentTable} agent ON account.agent_id = agent.id
            ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${accountTable} 
            ${wherePartSql}`
            //console.log('getAgentAccounts:', sql)
            //console.log('getAgentAccounts sumSql:', sumSql)
            let [accounts, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: (accounts || []).map(account => {
                    return {
                        id: account.id,
                        agentName: account.agentName,
                        accountName: account.account_name,
                        online: account.online,
                        createTime: formateTime(account.gmt_create),
                        modifyTime: formateTime(account.gmt_modify),
                    }
                }),
                total: totals && totals[0]['COUNT(*)'] || 0
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新商家账户
    async saveAgentAccount(account, id = '') {
        id = parseInt(id)
        try {
            let { accountName, password, online, agentId, isManage = 0 } = account
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${accountTable} 
                (account_name, pwd, agent_id, gmt_create, is_manage, online)
                SELECT '${accountName}', '${password}', ${agentId}, '${curTime}', ${isManage}, ${online}
                FROM DUAL
                WHERE NOT EXISTS
                (SELECT * FROM ${accountTable} 
                    WHERE account_name = '${accountName}'
                    AND is_manage = ${isManage});`
                //console.log('saveAgentAccount:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let testSql = `SELECT * FROM ${accountTable} 
                WHERE account_name = '${accountName}' AND is_manage = 0`
                let rows = await dbUtils.query(testSql)
                let oldId = rows && rows[0] && rows[0].id
                // 非修改名字并且存在用户名
                if (oldId !== id && rows.length > 0) {
                    return 0
                }
                let pwdSql = password ? ` pwd = '${password}',` : ''
                let updateSql = `UPDATE ${accountTable} 
                SET 
                    account_name = '${accountName}',${pwdSql}
                    online = ${online},
                    gmt_modify = '${curTime}'
                WHERE
                    id = ${id};`
                //console.log('updateAgentAccount:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
}

module.exports = agentAccount