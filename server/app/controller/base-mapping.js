/**
 * base-mappingAPI接口
 * @author xiaominliu
 * @date 2019-12-13
 */
const baseModel = require('../models/base-mapping');

exports.getPlatMapping = async function(ctx) {
    ctx.body = { data: await baseModel.getPlats() }
}
exports.getTicketTypeMapping = async function(ctx) {
    ctx.body = { data: await baseModel.getTicketTypes() }
}
exports.getAgents = async function(ctx) {
    ctx.body = { data: await baseModel.getAgents() }
}
exports.getSeats = async function(ctx) {
    ctx.body = { data: await baseModel.getSeats() }
}