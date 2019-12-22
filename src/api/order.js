/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'

export function getUnDealOrders() {
    return request({
        url: '/orders/undeal',
        method: 'GET',
    })
}

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
export function dealOrder(id, data) {
    return request({
        url: `/order/${id}`,
        method: 'PUT',
        data: data,
    })
}