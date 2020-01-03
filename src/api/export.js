/**
 * 商家API接口
 * @author xiaominliu
 * @date 2020-01-01
 */

import request from './request'
// 数据导出
export function exportExcel(url, query) {
    return request({
        url: url,
        method: 'GET',
        params: query,
        responseType: 'blob'
    })
}