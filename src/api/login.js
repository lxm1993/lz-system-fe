import request from './request'
/**
 * 登陆
 * @param {*} loginInfo 
 */
export function fLogin(loginInfo) {
    return request({
        url: '/login',
        method: 'post',
        params: loginInfo
    })
}
/**
 * 获取登陆用户信息
 */
export function fGetUserInfo() {
    return request({
        url: '/login/user',
        method: 'get',
    })
}