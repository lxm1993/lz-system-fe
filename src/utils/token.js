import Cookies from 'js-cookie';
const systemPath = location.pathname.slice(1)
const tokenKey = `${systemPath}-token`

export function getToken() {
    const token = Cookies.get(tokenKey)
    return token ? decodeURIComponent(token) : ''
}

export function setToken(key, token) {
    token = token ? encodeURIComponent(token) : ''
    return Cookies.set(key, token, { expires: 1 })
}

export function removeToken() {
    return Cookies.remove(tokenKey)
}