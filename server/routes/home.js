const HomeController = require('../controller/home')

const Router = require('koa-router')
const router = new Router()
router.prefix('/api')


router.get('/home/test', HomeController.getTest)

module.exports = router