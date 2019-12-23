const moment = require('moment');
moment.locale('zh-cn')
exports.getDiffTime = (end, start) => {
    let diff = moment(new Date(end)).diff(new Date(start))
    let diffDuration = moment.duration(diff);
    let day = diffDuration.days()
    let hour = diffDuration.hours()
    let minute = diffDuration.minutes()
    return `${day === 0 ? '' : day + '天'} ${hour === 0 ? '' : hour + '小时'} 
    ${minute === 0 ? '' : minute + '分钟'}`
}

exports.formateTime = (time) => {
    if (!time) {
        return ''
    }
    return moment(new Date(time || '')).utcOffset("+08:00").format('YYYY-MM-DD HH:mm:ss')
}