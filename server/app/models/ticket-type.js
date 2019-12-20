const dbUtils = require('../../db')
const moment = require('moment');
const ticketTypeTable = 'service_type_table'

const ticketType = {
    // 获取票务类型列表
    async getTicketTypes({ pageNum, pageSize }) {
        try {
            let start = (pageNum - 1) * pageSize
            let sql = `SELECT * FROM ${ticketTypeTable} 
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${ticketTypeTable}`
            //console.log('getTicketTypes:', sql)
            //console.log('getTicketTypes sumSql:', sumSql)
            let ticketTypes = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']
            return {
                rows: ticketTypes,
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新票务类型
    async saveTicketType(ticketType, id = '') {
        try {
            let { name } = ticketType
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                // let insertSql = `INSERT INTO ${ticketTypeTable} 
                // (name, gmt_create)
                // SELECT '${name}','${curTime}'
                // FROM DUAL
                // WHERE NOT EXISTS
                // (SELECT name FROM ${ticketTypeTable} WHERE name = '${name}');`
                let insertSql = `INSERT INTO ${ticketTypeTable}
                (name, gmt_create)
                VALUES
                ('${name}', '${curTime}')`
                //console.log('saveTicketType:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let updateSql = `UPDATE ${ticketTypeTable} 
                SET 
                    name = '${name}',
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
    // 删除票务类型
    async deleteTicketType(id) {
        try {
            let deleteSql = `DELETE FROM ${ticketTypeTable} WHERE id = ${id}`
            //console.log(`deleteTicketType: `, deleteSql)
            let data = await dbUtils.query(deleteSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = ticketType