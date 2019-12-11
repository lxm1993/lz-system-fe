'use strict'
const jwt = require('../../node_modules/jsonwebtoken')
const tokenSecret = require('../config/index').tokenSecret
const jwtcreateToken = async (userName) => {
    let playload = {
        userName: userName,
        ctime: Date.now(),
    }
    let token = await jwt.sign(playload, tokenSecret, {
        expiresIn: '12h',
    })
    return token
}
const jwtMiddleware = (ctx, next) => {
    // 将 token 中的数据解密后存到 ctx 中
    try {
        if (typeof ctx.request.headers.authorization === 'string') {
            const token = ctx.request.headers.authorization.slice(7)
            let jwtObject = jwt.verify(token, tokenSecret)
            ctx.userName = jwtObject.userName
        } else {
            throw { code: 401, message: 'no authorization' }
        }
    } catch (err) {
        throw { code: 401, message: err.message }
    }
    next()
}

module.exports = {
    jwtcreateToken,
    jwtMiddleware
}
