const dbUtils = require('../../db')
const moment = require('moment')
const { formateTime } = require('../utils/index')
const platTable = 'plat_info_table'

const plat = {
    // 获取平台列表
    async getPlats({ pageNum = 1, pageSize = 20, platName = '' }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = platName ? `WHERE plat_name LIKE '%${platName}%'` : ''
            let sql = `SELECT * FROM ${platTable} 
            ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${platTable} ${wherePartSql}`
            //console.log('getPlats:', sql)
            //console.log('getPlats sumSql:', sumSql)
            let [plats, totals] = await Promise.all([
                await dbUtils.query(sql),
                await dbUtils.query(sumSql)
            ])
            return {
                rows: (plats || []).map(plat => {
                    return {
                        id: plat.id,
                        platName: plat.plat_name,
                        tel: plat.tel,
                        manager: plat.manager,
                        remark: plat.remark,
                        online: plat.online,
                        createTime: formateTime(plat.gmt_create),
                        modifyTime: formateTime(plat.gmt_modify),
                    }
                }),
                total: totals && totals[0]['COUNT(*)'] || 0
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新平台
    async savePlat(plat, id = '') {
        try {
            let { platName, tel, manager, remark = null, online } = plat
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                let insertSql = `INSERT INTO ${platTable}
                (plat_name, tel, manager, remark, online, gmt_create)
                VALUES
                ('${platName}', '${tel}', '${manager}', '${remark}'), ${online}, '${curTime}'`
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let updateSql = `UPDATE ${platTable} 
                SET 
                    plat_name = '${platName}',
                    tel = '${tel}',
                    manager = '${manager}',
                    remark = '${remark}',
                    online = ${online},
                    gmt_modify = '${curTime}'
                WHERE
                    id = ${id};`
                //console.log('updatePlat:', updateSql)
                let data = await dbUtils.query(updateSql)
                return data.affectedRows
            }

        } catch (error) {
            let message = error.message.includes('ER_DUP_ENTRY') ?
                '平台已存在' : error.message
            throw new Error(message);
        }
    },
    // 删除平台
    async deletePlat(id) {
        try {
            let deleteSql = `DELETE FROM ${platTable} WHERE id = ${id}`
            //console.log(`deletePlat: `, deleteSql)
            let data = await dbUtils.query(deleteSql)
            return data.affectedRows
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = plat