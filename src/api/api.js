import axios from 'axios';
import Vue from 'vue';
let v = new Vue();

const api = async function(params) {
    const response = await axios(Object.assign({
        method: 'get',
    }, params))
    if (!response.data) {
        v.$message({
            message: '操作失败!未接收到正常的返回数据',
            type: 'error',
            duration: 5 * 1000,
        })
        throw new Error('未接收到正常的返回数据');
    }
    if (response.data.code === 200) {
        return response.data.data;
    } else {
        let msg = response.data.message || '操作失败!'
        v.$message({
            message: msg,
            type: 'error',
            duration: 5 * 1000,
        })
        throw new Error(msg);
    }
};

Object.assign(api, {
    get(url, data) {
        return api({
            url,
            params: data,
        });
    },
    post(url, data) {
        return api({
            method: 'post',
            url,
            data,
        });
    },
    put(url, data) {
        return api({
            method: 'put',
            url,
            data,
        });
    },
    delete(url) {
        return api({
            method: 'delete',
            url,
        });
    },
});

export default api;