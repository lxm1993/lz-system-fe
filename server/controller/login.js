const { createToken } = require('../util/jwtUtil')
const { InvalidQueryError } = require('../util/error')
const { userName } = require('../util/jwtUtil')
const dbUser = require('../models/system/user')
const dbLogin = require('../models/login')

const loginController = {
    async ssoLoginCallback(ctx) {
        try {
            let sso = new SSO()
            // 通过sso拿出userName
            let userName = await sso.exchange(ctx.request.body.ticket)
            // userName = 'xiaominliu@sohu-inc.com'
            if (!userName) {
                ctx.response.redirect(`/?errorcode=500`)
                return
            }
            let dbUserInfo = await dbUser.getUserInfoByName(userName)
            // 用户不存在
            if (!dbUserInfo) {
                ctx.response.redirect(`/?errorcode=401`)
                return
            }
            // 重定向到首页并添加token
            let token = await createToken(userName)
            ctx.response.redirect(`/#/?token=${token}`)
        } catch (error) {
            throw { code: 500, message: error.message }
        }
    },
    async ssoLoginOutCallback(ctx) {
        let appid = ctx.query.appid
        console.log('------loginout-----')
        console.log(appid)
        if (appid) {
            ctx.response.redirect(`/#/`)
        }
    },
    async getLoginUserInfo(ctx, next) {
        let user = userName(ctx)
        if (!user) {
            throw new InvalidQueryError()
        }
        let userInfo = await dbLogin.getLoginUserInfo(user)
        ctx.result = userInfo
        return next()
    },
}

module.exports = loginController