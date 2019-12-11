const LoginController = require('../controller/login')

const Router = require('koa-router')
const router = new Router()


router.get('/api/system/user', LoginController.getLoginUserInfo)


module.exports = router