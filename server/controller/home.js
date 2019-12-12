const dbHome = require('../models/home')
const loginController = {
    async getTest(ctx, next) {
        let users = await dbHome.getTest()
        ctx.result = users
        return next()
    },
}

module.exports = loginController