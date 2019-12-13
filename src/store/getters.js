const getters = {
    app: state => state.app,
    token: state => state.user.token,
    userName: state => state.user.userName,
    userInfo: state => state.user.userInfo,
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