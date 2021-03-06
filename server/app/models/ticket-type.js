const dbUtils = require('../../db')
const moment = require('moment');
const ticketTypeTable = 'service_type_table'

const ticketType = {
    // 获取票务类型列表
    async getTicketTypes({ pageNum = 1, pageSize = 20 }) {
        try {
            let start = (pageNum - 1) * pageSize
            let sql = `SELECT * FROM ${ticketTypeTable} 
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${ticketTypeTable}`
            //console.log('getTicketTypes:', sql)
            //console.log('getTicketTypes sumSql:', sumSql)
            let [ticketTypes, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: ticketTypes,
                total: totals && totals[0]['COUNT(*)'] || 0
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新票务类型
    async saveTicketType(ticketType, id = '') {
        try {
            let { name, online } = ticketType
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${ticketTypeTable}
                (name, online, gmt_create)
                VALUES
                ('${name}', ${online},'${curTime}')`
                //console.log('saveTicketType:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let updateSql = `UPDATE ${ticketTypeTable} 
                SET 
                    name = '${name}',
                    online = ${online},
                    gmt_modify = '${curTime}'
                WHERE
                    id = ${id};`
                //console.log('updateTicketType:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            let message = error.message.includes('ER_DUP_ENTRY') ?
                '票务类型已存在' : error.message
            throw new Error(message);
        }
    },
}

module.exports = ticketType