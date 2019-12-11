import { constantRouterMap } from '@/router'
// 遍历asyncRoutes动态路由
function forSearchArr(route, modules, parentPath = '') {
    let allModulePaths = modules.map(module => {
        return module.url
    })
    let arrNew = []
    for (let item of route) {
        let itemNew = { ...item } //解决浅拷贝共享同一内存地址
        let itemNewPath = parentPath ? `${parentPath}/${itemNew.path}` : itemNew.path
        if (allModulePaths.includes(itemNewPath)) {
            if (itemNew.children) {
                itemNew.children = forSearchArr(itemNew.children, modules, itemNewPath)
            }
            arrNew.push(itemNew)
        }
    }
    return arrNew
}
const permission = {
    namespaced: true,
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES(state, payload) {
            state.routes = [...constantRouterMap, ...payload]
            state.addRoutes = payload
        }
    },
    actions: {
        GenerateRoutes({ commit }, { modules, bNoNeedLogin, asyncRouterMap }) {
            return new Promise(resolve => {
                let routes = []
                if (bNoNeedLogin) {
                    routes = asyncRouterMap
                } else {
                    routes = forSearchArr(asyncRouterMap, modules)
                }
                commit('SET_ROUTES', routes)
                resolve(routes)
            })
        }
    }
}

export default permission