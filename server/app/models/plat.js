const dbUtils = require('../../db')
const moment = require('moment');
const platTable = 'plat_info_table'

const plat = {
    // 获取平台列表
    async getPlats({ pageNum, pageSize, platName = '' }) {
        try {
            let start = (pageNum - 1) * pageSize
            let wherePartSql = platName ? `WHERE plat_name LIKE '%${platName}%'` : ''
            let sql = `SELECT * FROM ${platTable} 
            ${wherePartSql}
            ORDER BY gmt_create DESC LIMIT ${start}, ${pageSize}`
            let sumSql = `SELECT COUNT(*) FROM ${platTable} ${wherePartSql}`
            //console.log('getPlats:', sql)
            //console.log('getPlats sumSql:', sumSql)
            let plats = await dbUtils.query(sql)
            let totals = await dbUtils.query(sumSql)
            let total = totals && totals[0]['COUNT(*)']
            return {
                rows: (plats || []).map(plat => {
                    return {
                        id: plat.id,
                        platName: plat.plat_name,
                        tel: plat.tel,
                        manager: plat.manager,
                        remark: plat.remark,
                        createTime: plat.gmt_create || '',
                        modifyTime: plat.gmt_modify || '',
                    }
                }),
                total: total
            }

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 新建更新平台
    async savePlat(plat, id = '') {
        try {
            let { platName, tel, manager, remark = null } = plat
            let curTime = moment().format("YYYY-MM-DD HH:mm:ss")
            // 新建
            if (!id) {
                // let insertSql = `INSERT INTO ${platTable} 
                // (plat_name, tel, manager, gmt_create,remark)
                // SELECT '${platName}', '${tel}', '${manager}', '${curTime}', '${remark}'
                // FROM DUAL
                // WHERE NOT EXISTS
                // (SELECT plat_name FROM ${platTable} WHERE plat_name = '${platName}');`
                let insertSql = `INSERT INTO ${platTable}
                (plat_name, tel, manager, gmt_create, remark)
                VALUES
                ('${platName}', '${tel}', '${manager}', '${curTime}', '${remark}')`
                //console.log('savePlat:', insertSql)
                let data = await dbUtils.query(insertSql)
                return data.affectedRows
            } else {
                let updateSql = `UPDATE ${platTable} 
                SET 
                    plat_name = '${platName}',
                    tel = '${tel}',
                    manager = '${manager}',
                    remark = '${remark}',
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