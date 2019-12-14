import { setToken } from '@/utils/token';
const app = {
    namespaced: true,
    state: {
        opened: sessionStorage.getItem('open') ? true : false,
        routes: [],
        websitTitle: '',
        user: '',
    },
    mutations: {
        SET_OPENED(state, value) {
            state.opened = String(value)
            sessionStorage.setItem('open', value)
        },
        SET_ROUTES(state, value) {
            state.routes = [...value]
        },
        SET_WEBSIT_TITLE(state, value) {
            state.websitTitle = value
        },
        SET_USER(state, value) {
            state.user = value
        },
    },
    actions: {
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                fGetUserInfo()
                    .then(res => {
                        if (res.code === 200 && res.data) {
                            setToken(`${res.userType}-token`, res.token)
                            commit('app/SET_USER', res.user)
                            resolve(res.data)
                        } else {
                            reject('error')
                        }
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        LoginOut({ commit }) {
            setToken()
            commit('SET_USER', null)
        },
    },
}

export default app