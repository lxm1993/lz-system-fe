const mysql = require('mysql')
const config = require('./config')
let Pool = mysql.createPool(config.lzDataBase)

const dbUtils = {
    // 查询
    query(sql, val) {
        return new Promise((resolve, reject) => {
            Pool.getConnection((err, connection) => {
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
    },
}

module.exports = dbUtils