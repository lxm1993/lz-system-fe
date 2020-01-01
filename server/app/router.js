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

const baseMappingController = require('./controller/base-mapping');
const LoginController = require('./controller/login');
const AccountController = require('./controller/account');
const PlatController = require('./controller/plat');
const TicketController = require('./controller/ticket');
const TicketAssignController = require('./controller/ticket-assign');
const AgentController = require('./controller/agent');
const AgentAccountController = require('./controller/agent-acount');
const orderController = require('./controller/order');
const agentOrderController = require('./controller/order-agent');
const orderPayController = require('./controller/order-pay');
const orderDealController = require('./controller/order-deal');


// 中间件
router.use(log);
router.use(user);
router.use('/api/*', ajax, auth);
router.use(['/admin', '/api/admin/*'], admin);
router.get('/api/user', LoginController.getLoginUser);
router.post('/login', ajax, LoginController.login);

// csp report
router.post('/report-violation', (req, res) => {
    if (req.body) {
        ctx.util.logger.error(`CSP Violation: ${req.body}`)
    } else {
        console.log('CSP Violation: No data received!')
    }
    res.status(204).end()
});

// 页面
router.get('/lzplat', PageController.lzPlat);
router.get('/lzadmin', PageController.lzAdmin);

//baseMapping
router.get('/api/base/plats', baseMappingController.getPlatMapping);
router.get('/api/base/ticket-types', baseMappingController.getTicketTypeMapping);
router.get('/api/base/agents', baseMappingController.getAgents);
router.get('/api/base/seats', baseMappingController.getSeats);

// 平台API
// 平台批量上传订单接口
router.post('/lzapi/order/batch-save', orderDealController.batchSaveOrders);

router.get('/api/orders', agentOrderController.getAgentOrders);
router.get('/api/orders/week', agentOrderController.getAgentOrdersWeek);
router.get('/api/orders/undeal', agentOrderController.getUnDealOrders);
router.get('/api/order/sum', agentOrderController.sumAgentOrder);
router.get('/api/order/:id', agentOrderController.getAgentOrder);
router.put('/api/order/success/:id', agentOrderController.dealOrderSuccess);
router.put('/api/order/failed/:id', agentOrderController.dealOrderFailed);
router.get('/api/order/sub-seats/:type', agentOrderController.getSubSeats);


// 管理后台API
// 账户
router.get('/api/admin/accounts', AccountController.getManageAccounts);
router.post('/api/admin/account', AccountController.saveAccount);
router.put('/api/admin/account/:id', AccountController.saveAccount);
router.del('/api/admin/account/:id', AccountController.deleteAccount);
// 平台
router.get('/api/admin/plats', PlatController.getPlats);
router.post('/api/admin/plat', PlatController.savePlat);
router.put('/api/admin/plat/:id', PlatController.savePlat);
router.del('/api/admin/plat/:id', PlatController.deletePlat);
// 票务类型
router.get('/api/admin/ticket-types', TicketController.getTicketTypes);
router.post('/api/admin/ticket-type', TicketController.saveTicketType);
router.put('/api/admin/ticket-type/:id', TicketController.saveTicketType);
router.del('/api/admin/ticket-type/:id', TicketController.deleteTicketType);
// 分佣
router.get('/api/admin/ticket-commissions', TicketController.getTicketCommissoins);
router.post('/api/admin/ticket-commission', TicketController.saveTicketCommissoin);
router.put('/api/admin/ticket-commission/:id', TicketController.saveTicketCommissoin);
router.del('/api/admin/ticket-commission/:id', TicketController.deleteTicketCommissoin);
// 票务配置
router.get('/api/admin/ticket-assigns', TicketAssignController.getTicketAssigns);
router.post('/api/admin/ticket-assign', TicketAssignController.saveTicketAssign);
router.put('/api/admin/ticket-assign/:id', TicketAssignController.saveTicketAssign);
router.del('/api/admin/ticket-assign/:id', TicketAssignController.deleteTicketAssign);
// 商家
router.get('/api/admin/agents', AgentController.getAgents);
router.post('/api/admin/agent', AgentController.saveAgent);
router.put('/api/admin/agent/:id', AgentController.saveAgent);
router.del('/api/admin/agent/:id', AgentController.deleteAgent);

router.get('/api/admin/agent-accounts', AgentAccountController.getAgentAccounts);
router.post('/api/admin/agent-account', AgentAccountController.saveAgentAccount);
router.put('/api/admin/agent-account/:id', AgentAccountController.saveAgentAccount);
router.del('/api/admin/agent-account/:id', AgentAccountController.deleteAgentAccount);
router.post('/api/admin/agent-account/status', AgentAccountController.changeAgentAccountStatus);
// 订单
router.get('/api/admin/orders', orderController.getOrders);
router.get('/api/admin/orders/week', orderController.getOrdersWeek);
router.get('/api/admin/order/sum', orderController.sumOrder);
router.get('/api/admin/order/:id', orderController.getOrder);
router.put('/api/admin/order/failed/:id', orderController.dealOrderFailed);
router.put('/api/admin/order/receipt/:id', orderController.changeOrderReceiptStatus);
// 新建订单-测试使用
router.post('/api/admin/order', orderDealController.createOrder);

// 订单结算
router.get('/api/admin/pays', orderPayController.getPayOrders);
router.put('/api/admin/pays/pay', orderPayController.changeOderPayStatus);

module.exports = router