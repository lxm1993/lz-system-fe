/**
 * 票量分配API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'

/**
 * 新建配置
 * @param {*} plat 
 * @param {*} id 
 */
export function saveTicketAssign(plat, id) {
    return request({
        url: id ? `/admin/ticket-assign/${id}` : '/admin/ticket-assign',
        method: id ? 'PUT' : 'POST',
        data: plat,
    })
}