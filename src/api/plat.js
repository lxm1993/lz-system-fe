/**
 * 平台API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'

/**
 * 新建修改平台
 * @param {*} plat 
 * @param {*} id 
 */
export function savePlat(plat, id) {
    return request({
        url: id ? `/admin/plat/${id}` : '/admin/plat',
        method: id ? 'PUT' : 'POST',
        data: plat,
    })
}
/**
 * 删除平台
 * @param {*} id 
 */
export function deletePlat(id) {
    return request({
        url: `/admin/plat/${id}`,
        method: 'DELETE',
    })
}