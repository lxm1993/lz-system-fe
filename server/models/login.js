const dbUtils = require('../util/dbUtils')
const _ = require('lodash')
const userTable = 'troubleshooting_user'
const roleTable = 'troubleshooting_role'
const moduleTable = 'troubleshooting_module'

const login = {
    async getLoginUserInfo(userName) {
        try {
            let userRoleIds = ''
            let userRoles = []
            let userModules = []
            let userRoleIdSql = `SELECT role_list from ${userTable} WHERE username = '${userName}'`
            console.log(`getUserRoleIds: `, userRoleIdSql)
            let roleIds = await dbUtils.troubleQuery(userRoleIdSql)
            userRoleIds = roleIds && roleIds[0] && roleIds[0].role_list

            if (userRoleIds) {
                let getRolesSql = `SELECT * from ${roleTable} WHERE id in (${userRoleIds})`
                console.log(`getUserRoles: `, getRolesSql)
                userRoles = await dbUtils.troubleQuery(getRolesSql)
            }
            if (userRoles.length > 0) {
                let allModuleIds = []
                userRoles.forEach(item => {
                    let moduleList = item.module_list.split(',')
                    allModuleIds = [
                        ...allModuleIds,
                        ...moduleList
                    ]
                })
                allModuleIds = _.uniq(allModuleIds).join(',')
                let getModulesSql = `SELECT * from ${moduleTable} WHERE id in (${allModuleIds})`
                console.log(`getModulesSql: `, getModulesSql)
                userModules = await dbUtils.troubleQuery(getModulesSql)
            }
            return {
                currentTimeMillis: new Date().getTime(),
                name: userName,
                modules: userModules,
                roles: userRoles,
            }
        } catch (error) {
            throw { code: 500, message: error.message }
        }
    }
}
module.exports = login
