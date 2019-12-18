import { get } from 'lodash'
import Vue from 'vue'
import * as oFilters from './filters'

for (let key in oFilters) {
    const f = oFilters[key]
    Vue.filter(key, f)
}

const godfilter = (val, type) => {
    const f = oFilters[type]
    if (typeof f === 'function') {
        return f(val)
    } else {
        if (process.env.NODE_ENV === 'development' && type) {
            console.error(`godfilter: ${type} 缺失`)
        }
    }
    return val
}

/**
 * render过滤器
 * @param {Object} data
 * @param {Object} config
 * 样例：
 * {
 *  prop: '',
 *  filter: '',
 *  formatter:  Function,
 * }
 */
const render = (data, config) => {
    if (data && config) {
        let prop = config.prop
        let filter = 'string'
        let formatter = config.formatter || data.formatter
        // 处理data中的filter
        filter = config.filter || data.filter
        let v = ''
        if (typeof formatter === 'function') {
            v = formatter(data, prop)
        } else {
            // 2019-04-24 修改，修复若data已为字符串时get失败问题
            // v = get(data, prop)
            v = typeof data !== 'string' ? get(data, prop) : data
        }
        return godfilter(v, filter)
    }
}

Vue.filter('godfilter', godfilter)

Vue.filter('render', render)

Vue.prototype.$filters = {
    ...oFilters,
    render,
    godfilter,
}