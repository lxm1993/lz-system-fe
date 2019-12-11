import systemConfig from '@/utils/config';
import Cookies from 'js-cookie';
const ssoUrl = 'https://sso.sohu-inc.com/login'
const ssoLogoutUrl = 'https://sso.sohu-inc.com/logout'
const systemName = location.pathname.slice(1)
const tokenKey = `${systemName}-Token`
const RedirectPathKey = `${systemName}-RedirectPathKey`


export function getSystemRedirectPath() {
    const sysPath = Cookies.get(RedirectPathKey)
    Cookies.remove(RedirectPathKey)
    return sysPath ? decodeURIComponent(sysPath) : ''
}

export function setSystemRedirectPath(path) {
    const sysPath = path ? encodeURIComponent(path) : ''
    return Cookies.set(RedirectPathKey, sysPath, { expires: 1 })
}

export function getSystemName() {
    return systemName
}

export function getToken() {
    const token = Cookies.get(tokenKey)
    return token ? decodeURIComponent(token) : ''
}

export function setToken(token) {
    token = token ? encodeURIComponent(token) : ''
    return Cookies.set(tokenKey, token, { expires: 1 })
}

export function removeToken() {
    return Cookies.remove(tokenKey)
}

export function getTokenFromLocal(route, callback) {
    let token = ''
    // 先从Url里面获取token参数
    if (route && route.query.token) {
        token = route.query.token
        setToken(token)
    }
    return token
}

export function redirectToSso() {
    location.href = `${ssoUrl}?appid=${systemConfig.ssoAppId}`
}

export function logoutSso() {
    location.href = `${ssoLogoutUrl}?appid=${systemConfig.ssoAppId}`
}