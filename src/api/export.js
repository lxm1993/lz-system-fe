/**
 * 商家API接口
 * @author xiaominliu
 * @date 2020-01-01
 */

import request from './request'
// 数据导出
export function exportAgentHome(query) {
    return request({
        url: '/orders/week/export-excel',
        method: 'GET',
        params: query,
        responseType: 'blob'
    })
}

export function exportAgentOrders(query) {
    return request({
        url: 'orders/export-excel',
        method: 'GET',
        params: query,
        responseType: 'blob'
    })
}