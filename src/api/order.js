/**
 * 订单API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'
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
 * 获取未处理订单
 */
export function getUnDealOrders() {
    return request({
        url: '/orders/undeal',
        method: 'GET',
    })
}
/**
 * 处理订单
 * @param {*} id 
 * @param {*} data 
 */
export function dealOrder(id, type, isAgent) {
    return request({
        url: isAgent ? `/order/${type}/${id}` : `/admin/order/${type}/${id}`,
        method: 'PUT',
    })
}
export function orderReceipt(id) {
    return request({
        url: `/admin/order/receipt/${id}`,
        method: 'PUT',
    })
}
/**
 * 首页订单统计
 * @param {*} isAgent 
 */
export function homeOrderInfo(isAgent) {
    return request({
        url: isAgent ? '/order/sum' : '/admin/order/sum',
        method: 'GET',
    })
}