/**
 * 路由配置
 * @author xiaominliu
 * @date 2019-12-13
 */
const Router = require('koa-router');
const router = new Router();

const log = require('./middlewares/log');
const user = require('./middlewares/user');
const auth = require('./middlewares/auth');
const ajax = require('./middlewares/ajax');
const admin = require('./middlewares/admin');

const PageController = require('./controller/page');
const LoginController = require('./controller/login');

// 中间件
router.use(log);
router.use(user);
router.use('/api/*', ajax, auth);
router.use(['/admin', '/api/admin/*'], admin);
router.get('/api/login/user', LoginController.getLoginUser);
router.post('/api/login', LoginController.login);


// 页面
router.get('/lz-plat', auth, PageController.lzPlat);
router.get('/lz-admin', auth, PageController.lzAdmin);

// 平台API


// 管理后台API
// router.post('/api/admin/login', LoginController.login);



module.exports = router