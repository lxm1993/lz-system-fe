import request from './request'

export function fLogin(loginInfo) {
    return request({
        url: '/login',
        method: 'post',
        params: loginInfo
    })
}

export function fGetUserInfo(loginInfo) {
    return request({
        url: '/login/user',
        method: 'get',
    })
}