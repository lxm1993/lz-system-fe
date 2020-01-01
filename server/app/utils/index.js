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

exports.isBetweenTime = function(times, current) {
    let isBetween = function(beginTime, endTime, nowTime) {
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
    let timeIsOneDay = (times) => {
        let time1 = times[0] && times[0].split(':')
        let time2 = times[1] && times[1].split(':')
        let hour1 = time1[0]
        let minute1 = time1[1]
        let hour2 = time2[0]
        let minute2 = time2[1]
        if (hour1 < hour2) {
            return true
        } else if (hour1 === hour2) {
            if (minute1 < minute2) {
                return true
            } else if (minute1 === minute2) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    let isOneDay = timeIsOneDay(times)
    if (isOneDay) {
        return isBetween(times[0], times[1], current)
    } else {
        return isBetween(times[0], '24:00', current) ||
            isBetween('00:00', times[1], current)
    }
}
/**
 * js数组实现权重概率分配，支持数字比模式(支持2位小数)和百分比模式(不支持小数，最后一个元素多退少补)
 * @param  Array  arr  js数组，参数类型[Object,Object,Object……]
 * @return  Array      返回一个随机元素，概率为其weight/所有weight之和，参数类型Object
 */
//参数arr元素必须含有weight属性，参考如下所示
//var arr=[{name:'1',weight:1.5},{name:'2',weight:2.5},{name:'3',weight:3.5}];
//var arr=[{name:'1',weight:'15%'},{name:'2',weight:'25%'},{name:'3',weight:'35%'
exports.weightRandom = function(arr) {
    //求出最大公约数以计算缩小倍数，perMode为百分比模式
    var per;
    var maxNum = 0;
    var perMode = false;
    //自定义Math求最小公约数方法
    Math.gcd = function(a, b) {
        var min = Math.min(a, b);
        var max = Math.max(a, b);
        var result = 1;
        if (a === 0 || b === 0) {
            return max;
        }
        for (var i = min; i >= 1; i--) {
            if (min % i === 0 && max % i === 0) {
                result = i;
                break;
            }
        }
        return result;
    };

    //使用clone元素对象拷贝仍然会造成浪费，但是使用权重数组对应关系更省内存
    var weight_arr = new Array();
    for (i = 0; i < arr.length; i++) {
        if ('undefined' != typeof(arr[i].weight)) {
            if (arr[i].weight.toString().indexOf('%') !== -1) {
                per = Math.floor(arr[i].weight.toString().replace('%', ''));
                perMode = true;
            } else {
                per = Math.floor(arr[i].weight * 100);
            }
        } else {
            per = 0;
        }
        weight_arr[i] = per;
        maxNum = Math.gcd(maxNum, per);
    }
    //数字比模式，3:5:7，其组成[0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
    //百分比模式，元素所占百分比为15%，25%，35%
    var index = new Array();
    var total = 0;
    var len = 0;
    if (perMode) {
        for (i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i];
            for (j = 0; j < len; j++) {
                //超过100%跳出，后面的舍弃
                if (total >= 100) {
                    break;
                }
                index.push(i);
                total++;
            }
        }
        //使用最后一个元素补齐100%
        while (total < 100) {
            index.push(arr.length - 1);
            total++;
        }
    } else {
        for (i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i] / maxNum;
            for (j = 0; j < len; j++) {
                index.push(i);
            }
            total += len;
        }
    }
    //随机数值，其值为0-11的整数，数据块根据权重分块
    var rand = Math.floor(Math.random() * total);
    // console.log('-----', rand);
    return arr[index[rand]];
}