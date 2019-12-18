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
        // 登陆过期
        if (response.data.code === 401) {
            removeToken()
            location.reload()
        }
        if (response.data.code !== 200) {
            let msg = response.data.message || '操作失败!'
            v.$message({
                message: msg,
                type: 'error',
                duration: 5 * 1000,
            })
            throw new Error(msg);
        }
        return response.data.data;
    },
    error => {
        return Promise.reject(error)
    },
)

export default service