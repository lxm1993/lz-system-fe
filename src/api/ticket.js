/**
 * 票务API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'
// 票务类型
/**
 * 新建票务类型
 * @param {*} ticketType 
 * @param {*} id 
 */
export function saveTicketType(ticketType, id) {
    return request({
        url: id ? `/admin/ticket-type/${id}` : '/admin/ticket-type',
        method: id ? 'PUT' : 'POST',
        data: ticketType,
    })
}

// 分佣配置
/**
 * 新建分佣
 * @param {*} ticketType 
 * @param {*} id 
 */
export function saveTicketCommission(ticketType, id) {
    return request({
        url: id ? `/admin/ticket-commission/${id}` : '/admin/ticket-commission',
        method: id ? 'PUT' : 'POST',
        data: ticketType,
    })
}