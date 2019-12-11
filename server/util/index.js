let parseTime = function(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        // 更新 如果time中包含时区 就把时区截取掉
        if (time && String(time).indexOf('.') > -1) {
            time = String(time).split('.')[0]
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]

        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}
module.exports.parseTime = parseTime
module.exports.getAllDay = function(start, end, split) {
    start = start.includes('-') ? start : new Date(`${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}`)
    end = end.includes('-') ? end : new Date(`${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}`)
    let st = new Date(start)
    let et = new Date(end)
    let timeDiff = et.getTime() - st.getTime()
    let dArr = []
    for (var i = 0; i <= timeDiff; i += 86400000) {
        let ds = new Date(st.getTime() + i)
        dArr.push(parseTime(ds, split ? '{y}-{m}-{d}' : '{y}{m}{d}'))
    }

    return dArr
}
