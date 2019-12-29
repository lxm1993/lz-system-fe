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

exports.isBetweenTime = function(beginTime, endTime, nowTime) {
    let strb = beginTime.split(":");
    if (strb.length != 2) {
        return false;
    }
    let stre = endTime.split(":");
    if (stre.length != 2) {
        return false;
    }
    let strn = nowTime.split(":");
    if (stre.length != 2) {
        return false;
    }
    let b = new Date();
    let e = new Date();
    let n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);
    n.setHours(strn[0]);
    n.setMinutes(strn[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
    } else {
        return false;
    }
}