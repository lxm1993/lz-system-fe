/**
 * 商家以及内部用户账号API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'

/**
 * 新建修改管理员用户
 * @param {*} account 
 * @param {*} id 
 */
export function saveManageAccount(account, id) {
    return request({
        url: id ? `/admin/account/${id}` : '/admin/account',
        method: id ? 'PUT' : 'POST',
        data: account,
    })
}
/**
 * 删除用户
 * @param {*} id 
 */
// export function deleteAccount(id) {
//     return request({
//         url: `/admin/account/${id}`,
//         method: 'DELETE',
//     })
// }