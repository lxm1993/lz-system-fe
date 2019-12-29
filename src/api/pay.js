/**
 * 结算API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'
/**
 * 结算处理
 * @param {*} id 
 * @param {*} data 
 */
export function payOders(data) {
    return request({
        url: '/admin/pays/pay',
        method: 'PUT',
        data: data,
    })
}