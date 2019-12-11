const getters = {
    app: state => state.app,
    addRoutes: state => state.permission.addRoutes,
    token: state => state.user.token,
    userName: state => state.user.userName,
    userInfo: state => state.user.userInfo,
    routes: state => state.permission.routes,
    opened: state => {
        if (state.app.opened === 'false') {
            return false
        } else if (state.app.opened === 'true') {
            return true
        }
    },
}
export default getters