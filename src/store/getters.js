const getters = {
    app: state => state.app,
    user: state => state.app.user,
    routes: state => state.app.routes,
    websitTitle: state => state.app.websitTitle,
    opened: state => {
        if (state.app.opened === 'false') {
            return false
        } else if (state.app.opened === 'true') {
            return true
        }
    },
}
export default getters