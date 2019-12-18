const dbUtils = require('../../db')
const ticketTypeTable = 'service_type_table'
const platTable = 'plat_info_table'
const getListMap = (list) => {
    let map = {}
    list.forEach(item => {
        map[item.datavalue] = item.dataname
    })
    return map
}
const bassingMapping = {
    // 获取平台列表
    async getPlats(map = false) {
        try {
            let sql = `SELECT * FROM ${platTable} ORDER BY gmt_create DESC`
            console.log('getPlatsMap:', sql)
            let plats = await dbUtils.query(sql)
            plats = plats || []
            let platList = plats.map(plat => {
                return {
                    datavalue: plat.id,
                    dataname: plat.plat_name,
                }
            })
            return map ? getListMap(platList) : platList

        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 获取票务类型列表
    async getTicketTypes(map = false) {
        try {
            let sql = `SELECT * FROM ${ticketTypeTable} ORDER BY gmt_create DESC`
            console.log('getTicketTypesMap:', sql)
            let ticketTypes = await dbUtils.query(sql)
            ticketTypes = ticketTypes || []
            let ticketList = ticketTypes.map(plat => {
                return {
                    datavalue: plat.id,
                    dataname: plat.name,
                }
            })
            return map ? getListMap(ticketList) : ticketList

        } catch (error) {
            throw new Error(error.message);
        }
    }
}
module.exports = bassingMapping