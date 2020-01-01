const orderDealModel = require('../models/order-deal');
const LinetoHump = (name) => {
    return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
    });
}
let getHumOrder = (object) => {
    let order = {}
    Object.keys(object).forEach(key => {
        let lineKey = LinetoHump(key)
        order[lineKey] = object[key]
        if (key === 'subOrders') {
            let subOrders = object[key] || []
            order[lineKey] = subOrders.map(subOrder => {
                return getHumOrder(subOrder)
            })
        }
    })
    return order
}
module.exports.createOrder = async function(ctx) {
    const order = ctx.request.body
    // let orders = []
    // for (let i = 1; i < 11; i++) {
    //     let newOrder = { ...order, pOrderId: order.pOrderId + i }
    //     orders.push(newOrder)
    // }
    // let effectRows = await orderDealModel.batchSaveOrders(orders);
    let effectRows = await orderDealModel.createOrder(order);
    if (effectRows === 0) {
        throw new Error('添加失败');
    }
    ctx.body = { message: '添加成功' }
}
module.exports.batchSaveOrders = async function(ctx) {
    const { orders } = ctx.request.body
    if (!orders || orders.length === 0) {
        throw new Error('订单列表为空');
    }
    let effectRows = await orderDealModel.batchSaveOrders(orders);
    ctx.body = { message: '添加成功', data: effectRows }
}