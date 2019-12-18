/**
 * 商家API接口
 * @author xiaominliu
 * @date 2019-12-13
 */
import request from './request'

/**
 * 新建修改商家用户
 * @param {*} agent
 * @param {*} id 
 */
export function saveAgent(agent, id) {
    return request({
        url: id ? `/admin/agent/${id}` : '/admin/agent',
        method: id ? 'PUT' : 'POST',
        data: agent,
    })
}
/**
 * 删除商家用户
 * @param {*} id 
 */
export function deleteAgent(id) {
    return request({
        url: `/admin/agent/${id}`,
        method: 'DELETE',
    })
}

/**
 * 新建修改商家账户
 * @param {*} account 
 * @param {*} id 
 */
export function saveAgentAccount(account, id) {
    return request({
        url: id ? `/admin/agent-account/${id}` : '/admin/agent-account',
        method: id ? 'PUT' : 'POST',
        data: account,
    })
}
/**
 * 删除商家账户
 * @param {*} id 
 */
export function deleteAgentAccount(id) {
    return request({
        url: `/admin/agent-account/${id}`,
        method: 'DELETE',
    })
}

/**
 * 修改商家账户状态
 * @param {*} id 
 */
export function changeAgentAccountStatus(data) {
    return request({
        url: '/admin/agent-acount/status',
        method: 'POST',
        data: data,
    })
}