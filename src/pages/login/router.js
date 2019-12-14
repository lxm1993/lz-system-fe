import Vue from 'vue';
import Router from 'vue-router';
import Index from './views/index';

Vue.use(Router);
const routers = [{
    path: '*',
    component: Index,
    hidden: true,
}]
const router = new Router({
    mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: routers,
})
router.beforeEach(async (to, from, next) => {
    if (to.path !== '/') {
        next({
            ...to,
            path: '/',
            replace: true,
        })
    }
    next()
})

export default router