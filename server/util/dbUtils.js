const mysql = require('mysql')
const config = require('../config')

/**
 * 获取数据库连接池
 */
let troubleShootingPool = mysql.createPool(config.troubleShootingDataBase)

function generateQuery(pool, sql, val) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(sql, val, (err, res) => {
                connection.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    })
}
const dbUtils = {
    // 查询
    troubleQuery(sql, val) {
        return generateQuery(troubleShootingPool, sql, val)
    },
}

module.exports = dbUtils