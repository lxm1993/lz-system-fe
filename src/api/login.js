import api from './api'
export function fLogin(loginInfo) {
    return api.get('/login', loginInfo)
}