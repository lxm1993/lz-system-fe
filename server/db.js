const mysql = require('mysql')
const config = require('../config')
let Pool = mysql.createPool(config.lzDataBase)

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
    query(sql, val) {
        return generateQuery(Pool, sql, val)
    },
}

module.exports = dbUtils