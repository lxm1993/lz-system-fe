const dbUtils = require('../../db')
const moment = require('moment');
const { formateTime } = require('../utils/index')
const accountTable = 'account_table'

const account = {
    // 获取登陆用户信息
    async getLoginAccount(username, admin) {
        try {
            let accountSql = `SELECT * FROM ${accountTable} 
            WHERE account_name = '${username}'
            AND is_manage = ${admin}`
            //console.log('getLoginAccount:', accountSql)
            let accounts = await dbUtils.query(accountSql)
            let account = accounts && accounts[0]
            return account ? {
                id: account.id,
                accountName: account.account_name,
                isManage: account.is_manage,
                online: account.online,
                agentId: account.agent_id,
                pwd: account.pwd
            } : null

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取登陆用户信息
    async getAccount(accountId) {
        try {
            let accountSql = `SELECT * FROM ${accountTable} 
            WHERE id = ${accountId}`
            //console.log('getAccount:', accountSql)
            let accounts = await dbUtils.query(accountSql)
            let account = accounts && accounts[0]
            return account ? {
                id: account.id,
                accountName: account.account_name,
                isManage: account.is_manage,
                online: account.online,
                agentId: account.agent_id,
            } : null

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取用户列表
    async getManageAccounts({ pageNum = 1, pageSize = 20, accountName = '' }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = accountName ? `AND account_name LIKE '%${accountName}%'` : ''
            let sql = `SELECT * FROM ${accountTable} 
            WHERE is_manage = 1 ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${accountTable} 
            WHERE is_manage = 1 ${wherePartSql}`
            let [accounts, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: (accounts || []).map(account => {
                    return {
                        id: account.id,
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
    // 新建更新用户
    async saveAccount(account, id = '') {
        id = parseInt(id)
        try {
            let { accountName, password, online, isManage = 1 } = account
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${accountTable} 
                (account_name, pwd, gmt_create, is_manage, online)
                SELECT '${accountName}', '${password}','${curTime}', ${isManage}, 1
                FROM DUAL
                WHERE NOT EXISTS
                (SELECT * FROM ${accountTable} 
                    WHERE account_name = '${accountName}'
                    AND is_manage = ${isManage});`
                //console.log('saveAccount:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let testSql = `SELECT * FROM ${accountTable} 
                WHERE account_name = '${accountName}' AND is_manage = ${online}`
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
                //console.log('updateAccounts:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 删除用户
    // async deleteAccount(id) {
    //     try {
    //         let deleteSql = `DELETE FROM ${accountTable} WHERE id = ${id}`
    //         //console.log(`deleteAccount: `, deleteSql)
    //         let data = await dbUtils.query(deleteSql)
    //         return data.affectedRows
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }
}

module.exports = account