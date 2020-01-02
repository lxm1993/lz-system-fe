import { getToken, removeToken } from "@/utils/token";
import axios from 'axios';
import Vue from 'vue';
let v = new Vue();

const loginBase = process.env.NODE_ENV === 'development' ?
    'http://localhost:3005/' : '/'

const service = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ?
        'http://localhost:3005/api' : '/api',
    timeout: 30000, // 请求超时时间
})

service.interceptors.request.use(
    config => {
        let token = getToken()
        if (token) {
            config.headers.common['Authorization'] = 'Bearer ' + token
        }
        config.baseURL = config.url === '/login' ? loginBase : config.baseURL
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
            v.$message({
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
        // 登陆过期
        if (res.code === 401) {
            removeToken()
            location.reload()
        }
        // 登陆特殊处理
        if (response.config.url.includes('/login')) {
            return res
        }
        if (res.code !== 200) {
            let msg = res.message || '操作失败!'
            v.$message({
                message: msg,
                type: 'error',
                duration: 5 * 1000,
            })
            throw new Error(msg);
        }
        return res.data;
    },
    error => {
        return Promise.reject(error)
    },
)

export default service