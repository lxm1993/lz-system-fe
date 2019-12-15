const dbUtils = require('../../db')
const accountTable = 'account_table'

const account = {
    // 获取管理员用户信息
    async getLoginAccount(username, password = '', admin = '') {
        try {
            let accountSql = password ?
                `SELECT * from ${accountTable} 
            WHERE account_name = '${username}'
            AND pwd = '${password}'
            AND is_manage = ${admin}` :
                `SELECT * from ${accountTable} 
            WHERE account_name = '${username}'`

            console.log('getLoginAccount:', accountSql)
            let accounts = await dbUtils.query(accountSql)
            let account = accounts && accounts[0]
            return account ? {
                id: account.id,
                accountName: account.account_name,
                isManage: account.is_manage,
            } : null

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = account