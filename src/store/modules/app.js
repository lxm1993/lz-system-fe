const app = {
    namespaced: true,
    state: {
        opened: sessionStorage.getItem('open') ?
            sessionStorage.getItem('open') : 'false',
        serverTime: 0,
        routes: [],
        websitTitle: '',
        user: '',
    },
    mutations: {
        SET_OPENED(state, value) {
            state.opened = String(value)
            sessionStorage.setItem('open', value)
        },
        INIT_SERVER_TIME(state, value) {
            state.serverTime = value
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

    },
}

export default app