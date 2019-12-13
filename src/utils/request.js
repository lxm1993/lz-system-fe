import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';

// 设置跨域传递cookie
// axios.defaults.withCredentials = true;
// 创建axios实例
const service = axios.create({
    baseURL: '/',
    timeout: 30000, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            // 让每个请求携带自定义token 请根据实际情况自行修改
            config.headers['X-Token'] = store.getters.token
        }
        return config
    },
    error => {
        Promise.reject(error)
    },
)

// respone拦截器
service.interceptors.response.use(
    response => {
        if (!response.data) {
            Message({
                message: '操作失败!未接收到正常的返回数据',
                type: 'error',
                duration: 5 * 1000,
            })
            return Promise.reject(new Error('未接收到正常的返回数据'))
        }
        let res = response.data
        try {
            if (res instanceof Blob) {
                res.filename = response.headers['content-disposition']
                return res
            } else {
                if (typeof res === 'string') {
                    res = JSON.parse(res)
                }
            }
        } catch (e) {
            let _msg = '无法解析服务端的返回值，可能后台出现了问题，请联系管理员'
            Message({
                message: _msg,
                type: 'error',
                duration: 5 * 1000,
            })
            return Promise.reject(new Error(e.message))
        }

        const { url } = response.config
        // 2019-04-09新增，处理非baseURL请求，非baseURL请求不走拦截器
        // todo上线时可能需要修改，非baseURL请求可能会改成由ng转发，以解决VPN访问内网问题
        // 此时可以改成将相应接口统一加一个前缀，以做区分
        if (url.startsWith(api) && res.code !== 200) {
            let _msg = ''
            // -1表示token过期，登录失效了
            if (res.code === 401) {
                store.dispatch('FedLogOut').then(() => {
                    // 为了重新实例化vue-router对象 避免bug
                    location.reload()
                })
            } else {
                _msg = res.message || res.msg || '操作失败!'
                Message({
                    message: _msg,
                    type: 'error',
                    duration: 5 * 1000,
                })
            }
            return Promise.reject(new Error(_msg))
        } else {
            return res
        }
    },
    error => {
        let _msg = error.message
        const { data } = error.response
        if (data.msg) {
            _msg = data.msg
        }

        if (data.code === 401) {
            // 登录失败
            store.dispatch('user/LoginOut')
            return
        }
        const _suffix = '请重试一次，如果再次出现错误请联系管理员'
        if (/network/i.test(_msg)) {
            _msg = `请求服务器时出现了错误，${_suffix}`
        } else if (/timeout/i.test(_msg)) {
            _msg = `服务器返回超时了，${_suffix}`
        } else if (/404/.test(_msg)) {
            _msg = '找不到后台地址,后台可能出现了问题,请联系管理员'
        } else if (/java/.test(_msg)) {
            _msg = '输入参数有误，重新输入～'
        }
        Message({
            message: _msg,
            showClose: true,
            type: 'error',
            duration: 5 * 1000,
        })
        return Promise.reject(error)
    },
)

export default service