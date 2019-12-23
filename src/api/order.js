/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'
/**
 * 获取未处理订单
 */
export function getUnDealOrders() {
    return request({
        url: '/orders/undeal',
        method: 'GET',
    })
}
/**
 * 获取订单信息
 * @param {*} id 
 */
export function getOrderInfo(id) {
    return request({
        url: `/admin/order/${id}`,
        method: 'GET',
    })
}
/**
 * 获取代售点订单信息
 * @param {*} id 
 */
export function getAgentOrderInfo(id) {
    return request({
        url: `/order/${id}`,
        method: 'GET',
    })
}
/**
 * 处理订单
 * @param {*} id 
 * @param {*} data 
 */
export function dealOrder(id, data) {
    return request({
        url: `/order/${id}`,
        method: 'PUT',
        data: data,
    })
}

export function homeOrderInfo(isAgent) {
    return request({
        url: isAgent ? '/order/sum' : '/admin/order/sum',
        method: 'GET',
    })
}