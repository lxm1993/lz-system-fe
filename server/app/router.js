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

router.post('/api/login', LoginController.login);
router.get('/api/login/user', LoginController.getLoginUser);


// 页面
router.get('/lz-plat', auth, PageController.lzPlat);
router.get('/lz-admin', auth, PageController.lzAdmin);

// 平台API
// router.get('/api/projects', projectController.list);


// 管理后台API
// router.get('/api/admin/projects', projectController.list);


module.exports = router