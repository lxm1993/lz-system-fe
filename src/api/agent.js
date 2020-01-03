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