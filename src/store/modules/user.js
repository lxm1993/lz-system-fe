import { getUserInfo } from '@/api/login';
import store from '@/store';
import { logoutSso, removeToken, setToken } from '@/utils/tokenSso'; // 验权

const user = {
    namespaced: true,
    state: {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : '', // 认证凭证'
        opened: sessionStorage.getItem('open') ?
            sessionStorage.getItem('open') : 'false',
        userName: '',
        userInfo: '',
    },
    mutations: {
        SET_NAME(state, payload) {
            state.userName = payload
        },
        SET_USER_INFO(state, payload) {
            state.userInfo = payload
        },
        SET_TOKEN(state, val) {
            state.token = val
            setToken(val)
        },
        DEL_TOKEN(state) {
            state.token = ''
            state.userName = ''
            removeToken()
        },
        SET_OPENED(state, payload) {
            state.opened = String(payload)
            sessionStorage.setItem('open', payload)
        },
    },
    actions: {
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    if (res.code === 200 && res.data) {
                        let time = new Date(res.data.currentTimeMillis).getTime() || Date.now()
                        store.commit('app/INIT_SERVER_TIME', time)
                        commit('SET_USER_INFO', res.data.name)
                        commit('SET_NAME', name)
                        resolve(res.data)
                    } else {
                        reject('error')
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        LoginOut({ commit }) {
            commit('SET_TOKEN', '')
            commit('SET_USER_INFO', null)
            logoutSso()

        }
    }
}

export default user