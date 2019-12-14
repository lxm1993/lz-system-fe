import { setToken } from '@/utils/token';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        opened: sessionStorage.getItem('open') === 'false' ? true : false,
        routes: [],
        websitTitle: '',
        user: '',
    },
    mutations: {
        SET_OPENED(state, value) {
            state.opened = value
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
        LoginOut({ commit }) {
            setToken('lz-admin-token', '')
            commit('SET_USER', null)
        },
    }
});