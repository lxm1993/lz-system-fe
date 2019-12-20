/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'
/**
 * 订单信息
 * @param {*} plat 
 * @param {*} id 
 */
export function getOrderInfo(id) {
    return request({
        url: `/admin/order/${id}`,
        method: 'GET',
    })
}

export function getAgentOrderInfo(id) {
    return request({
        url: `/order/${id}`,
        method: 'GET',
    })
}