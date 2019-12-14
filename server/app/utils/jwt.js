const config = require('../../config')
const jwt = require('jsonwebtoken')

module.exports.createToken = async (user) => {
    let playload = {
        ...user,
        ctime: Date.now(),
    }
    let token = await jwt.sign(playload, config.token.secret, {
        expiresIn: config.token.expireTime,
    })
    return token
}