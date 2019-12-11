const PageController = require('../controller/page')

const Router = require('koa-router')
const router = new Router()

// 页面
router.get('/lz', PageController.lz)
router.get('/lz-admin', PageController.lzAdmin)

module.exports = router