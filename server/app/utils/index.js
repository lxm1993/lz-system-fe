const moment = require('moment');
moment.locale('zh-cn')
exports.getDiffTime = (start, end) => {
    let diff = moment(new Date(start)).diff(new Date(end))
    let diffDuration = moment.duration(diff);
    let day = diffDuration.days()
    let hour = diffDuration.hours()
    let minute = diffDuration.minutes()
    return `${day === 0 ? '' : day + '天'} ${hour === 0 ? '' : hour + '小时'} 
    ${minute === 0 ? '' : minute + '分钟'}`
}