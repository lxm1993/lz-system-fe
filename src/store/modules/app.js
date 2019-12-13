const app = {
    namespaced: true,
    state: {
        opened: sessionStorage.getItem('open') ?
            sessionStorage.getItem('open') : 'false',
        loginTime: 0,
        serverTime: 0,
        routes: [],
        websitTitle: '',
    },
    mutations: {
        SET_OPENED(state, value) {
            state.opened = String(value)
            sessionStorage.setItem('open', value)
        },
        INIT_SERVER_TIME(state, value) {
            state.serverTime = value
            state.loginTime = Date.now()
        },
        SET_ROUTES(state, value) {
            state.routes = [...value]
        },
        SET_WEBSIT_TITLE(state, value) {
            state.websitTitle = value
        }
    },
    actions: {

    },
}

export default app