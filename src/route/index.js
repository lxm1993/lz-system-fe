import { fGetUserInfo } from "@/api/login";
import { getToken } from "@/utils/token";
import Router from 'vue-router';


const constantRouterMap = [{
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/'),
    hidden: true,
}, ]
export const creatRouter = (routes, store) => {
    routes = [...constantRouterMap, ...routes]
    const router = new Router({
        scrollBehavior: () => ({ y: 0 }),
        routes: routes,
    })
    store.commit('SET_ROUTES', routes)
    router.beforeEach(async (to, from, next) => {
        // 不重定向白名单
        if (['/login'].includes(to.path)) {
            next()
            return
        }
        next()
        console.log(store.state)
        if (!store.state.user) {
            let token = getToken()
            if (!token) {
                next({ path: '/login' })
                return
            }
            try {
                let user = await fGetUserInfo()
                store.commit('SET_USER', user)
                next()
                return
            } catch (error) {
                console.log(error)
            }
        } else {
            next()
            return
        }
    })
    return router
}