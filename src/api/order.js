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
export function dealOrderFail(id, isAgent) {
    return request({
        url: isAgent ? `/order/failed/${id}` : `/admin/order/failed/${id}`,
        method: 'PUT',
    })
}
export function dealOrderSuccess(id, subOders) {
    return request({
        url: `/order/success/${id}`,
        method: 'PUT',
        data: subOders,
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
/**
 * 新建订单
 * @param {* } order
 */
export function saveOrder(order) {
    return request({
        url: '/admin/order',
        method: 'POST',
        data: order,
    })
}