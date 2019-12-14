import Layout from '@/layout';
import store from '@/store';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const routers = [{
    path: '/',
    name: 'order',
    component: Layout,
    redirect: '/list',
    children: [{
        path: 'list',
        name: 'order-list',
        component: () => import('./views/order/index'),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
    }]
}]
const router = new Router({
    mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: routers,
})
router.beforeEach(async (to, from, next) => {
    store.commit('app/SET_ROUTES', routers)
    store.commit('app/SET_WEBSIT_TITLE', '灵众票务平台')
    setTimeout(() => {
        store.commit('app/SET_USER', window.DATA && window.DATA.user)
    }, 0);
    next()
})
export default router