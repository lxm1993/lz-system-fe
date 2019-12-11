const jwtToken = require('../../node_modules/jsonwebtoken')
const config = require('../config/index')

exports.createToken = async (userName) => {
    let playload = {
        userName: userName,
        ctime: Date.now(),
    }
    let token = await jwtToken.sign(playload, config.tokenSecret, {
        expiresIn: config.tokenExpireTime,
    })
    return token
}

// 从ctx中解析user
exports.userName = ctx => {
    try {
        if (typeof ctx.request.headers.authorization === 'string') {
            let token = ctx.request.headers.authorization.slice(7)
            let tokenInfo = jwtToken.decode(token)
            return tokenInfo.userName || ''
        } else {
            throw { code: 401, message: 'no authorization' }
        }
    } catch (error) {
        throw { code: 401, message: 'no authorization' }
    }
}
