const dbUtils = require('../util/dbUtils')

const home = {
    async getTest() {
        try {
            let users = dbUtils.lzTestQuery('select * from user_test')
            return users
        } catch (error) {
            throw { code: 500, message: error.message }
        }
    }
}
module.exports = home