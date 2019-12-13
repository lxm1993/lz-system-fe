import request from '@/utils/request'
export function fTest(params) {
    return request({
        url: '/home/test',
        method: 'get',
        params,
    })
}