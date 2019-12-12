const LoginController = require('../controller/login')

const Router = require('koa-router')
const router = new Router()
router.prefix('/api')


router.get('/system/user', LoginController.getLoginUserInfo)

module.exports = router