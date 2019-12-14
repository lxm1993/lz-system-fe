import { get } from 'lodash'
export function parseTime(time, cFormat) {
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

export function fWarn(...args) {
    // todo 检测环境，以及增加调用栈信息输出
    console.warn(...args)
}

export function objectToFormData(obj, form, namespace = '') {
    var fd = form || new FormData()
    var formKey
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i]
            if (typeof item === 'object' && !(item instanceof File)) {
                objectToFormData(item, fd, namespace + `[${i}]`)
            } else {
                fd.append(namespace, item)
            }
        }
    } else {
        for (var property in obj) {
            if (
                obj.hasOwnProperty(property) &&
                (obj[property] !== null && obj[property] !== undefined)
            ) {
                if (namespace) {
                    formKey = namespace + '[' + property + ']'
                } else {
                    formKey = property
                }

                if (
                    typeof obj[property] === 'object' &&
                    !(obj[property] instanceof File)
                ) {
                    // 此处将formKey递归下去很重要，因为数据结构会出现嵌套的情况
                    objectToFormData(obj[property], fd, formKey)
                } else {
                    // if it's a string or a File object
                    fd.append(formKey, obj[property])
                }
            }
        }
    }
    return fd
}

export function fParam(obj) {
    let arr = []
    if (obj) {
        for (let key in obj) {
            arr.push(`${key}=${obj[key]}`)
        }
    }
    return arr.join('&')
}

/**
 * 寻找当前页面上的第一个错误位置，并自动滚动到此处
 * 如果找不到错误的位置，则不作任何处理
 * @param {Object} element 出现错误的元素
 */
export function fScrollToFirstError(element, index = 0) {
    // console.log(anime)
    const _sClass = '.is-error'
    const _dFirstError = element || document.querySelector(_sClass)
    if (_dFirstError) {
        const _nTop = _dFirstError.offsetTop
        if (_nTop) {
            let _nNowScroll = window.scrollY
            const _nOneStep = 40
            let _nStep = 0
            if (_nNowScroll > _nTop) {
                _nStep = -_nOneStep
            } else if (_nNowScroll < _nTop) {
                _nStep = _nOneStep
            }
            if (_nStep) {
                const _fScroll = () => {
                    const _nFinal = Math.max(_nTop - _nOneStep, 0)
                    if (_nNowScroll > _nFinal) {
                        // window.scrollTo(0, _nNowScroll + _nStep)
                        window.scroll({
                            top: _nNowScroll + _nStep,
                            behavior: 'smooth',
                        })
                        // anime({
                        //   targets: '#app',
                        //   translateY: _nNowScroll + _nStep,
                        // })
                        _nNowScroll = window.scrollY
                        console.log(_nFinal)
                        // window.requestAnimationFrame(_fScroll)
                    }
                }
                _fScroll()
            }
        } else {
            const _dFirstErrors = document.querySelectorAll(_sClass)
            if (_dFirstErrors.length > 1 && _dFirstErrors.length < index) {
                index++
                fScrollToFirstError(_dFirstErrors[index], index)
            }
        }
    }
}

// 对 sessionStorage 进行存取操作
export function session(key, value) {
    if (!window.sessionStorage) {
        return
    }
    if (key) {
        if (typeof value === 'undefined') {
            return decodeURIComponent(sessionStorage.getItem(key))
        } else {
            sessionStorage.setItem(key, encodeURIComponent(value))
        }
    }
}

/**
 * 从数组中搜索，若不传matchFunc，则使用 === 比较
 * @param {Array} source
 * @param {any} item
 * @param {Function|Opional} matchFunc
 * 对比函数，参数为 (item, array[i])，用于处理非 === 情况
 * 如搜索id=5的Object
 */
export function fSearch(source, item, matchFunc = null) {
    if (source && source.length) {
        let i = 0
        let bFlag = typeof matchFunc === 'function'
        while (i < source.length) {
            let o = source[i]
            let b = bFlag ? matchFunc(item, o) : item === o
            if (b) {
                return i
            }
            i++
        }
    }
    return -1
}

/**
 * 从数组中搜索，若不传matchFunc，则使用 === 比较
 * @param {Array} source
 * @param {any} item
 * @param {Function|Opional} matchFunc
 * 对比函数，参数为 (item, array[i])，用于处理非 === 情况
 * 如搜索id=5的Object
 * @return Object | null
 */
export function fSearchObject(source, item, matchFunc = null) {
    if (source && source.length) {
        let i = 0
        let bFlag = typeof matchFunc === 'function'
        while (i < source.length) {
            let o = source[i]
            let b = bFlag ? matchFunc(item, o) : item === o
            if (b) {
                return o
            }
            i++
        }
    }
    return null
}

/**
 * 给对象设置属性，可通过链式或数组形式设置值
 * 如 'a.b.c' 或 ['a', 'b', 'c']
 * @param {Object} obj
 * @param {Array|String} keys
 * @param {any} data
 * @param {Function|Optional} setFunc
 * 设置函数，用于特殊情况下，如Vue需调用$set等情况下使用。函数参数为 (obj, key, data)
 */
export function setProporty(obj, keys, data, setFunc = null) {
    if (obj && keys) {
        if (typeof keys === 'string') {
            keys = keys.split('.')
        }

        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj) {
                break
            }
            obj = obj[keys[i]]
        }

        let key = keys[keys.length - 1]
        if (obj && key) {
            if (typeof setFunc === 'function') {
                setFunc(obj, key, data)
            } else {
                obj[key] = data
            }
        }
    }
}

/**
 * 将多个list里的数据按给定字段名转换为key-value数组
 * 如将 saleNames = '张三,李四,王五', saleIds = [101, 102, 103]
 * 按 ['name','id']顺序转为对象数组
 * [
 *  {name: '张三', id: 101}, {name: '李四', id: 102}, {name: '王五', id: 103},
 * ]
 *
 * @param {Array} keys
 * @param  {...any} args
 */
export function fLists2KeyValueList(keys, ...args) {
    const list = []
    if (keys && args.length > 0) {
        args = args.map(v => {
            if (typeof v === 'string' && !!v) {
                v = v.split(',')
            }
            return v
        })

        let length = args[0].length
        let ia = 0
        while (ia < length) {
            let o = {}
            keys.forEach((key, index) => {
                let values = args[index]
                if (values) {
                    o[key] = values[ia]
                }
            })
            list.push(o)
            ia++
        }
    }
    return list
}


export function getLastMonth(time) {
    const date = new Date(time)
    date.setMonth(date.getMonth() - 1)
    return date
}

/**
 * 筛选所有非空字段值
 * @param {Object} params
 */
export function getNotNullValues(params) {
    const obj = {}
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                obj[key] = value
            }
        })
    }
    return obj
}

export const await2 = promise => {
    return promise.then(data => [null, data]).catch(error => [error, null])
}

/**
 * 建立筛选的字典
 * @param {Object} params // reducer前置处理函数
 */
export function getkeyValueObjFromDataList({
    list = [],
    keyname = 'dataname',
    valueName = 'datavalue',
    reducer = null,
}) {
    if (list.length <= 0) {
        return
    }
    if (reducer) {
        list = reducer()
    }
    let obj = {}
    list.forEach(item => {
        let key = get(item, keyname)
        let value = get(item, valueName)
        obj[key] = value
    })
    return obj
}

export function getAllDay(start, end, split) {
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

export function sortDate(Arr) {
    var result = []
    Arr.forEach((v, i) => {
        var temp = result[result.length - 1]
        if (!i) {
            result.push([v])
        } else if (v - temp[temp.length - 1] === 86400000) {
            // } else if (v - temp[temp.length - 1] === 1) {
            temp.push(v)
        } else {
            result.push([v])
        }
    })
    return result.map(v => {
        if (v.length === 1) {
            return parseTime(v[0], '{y}-{m}-{d}')
        } else {
            return (
                parseTime(v[0], '{y}-{m}-{d}') +
                '/' +
                parseTime(v[v.length - 1], '{y}-{m}-{d}')
            )
        }
    })
}

export function reverseObjectKeyValue(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key
        return acc
    }, {})
}
export function splitTime(dateTime, count) {
    let times = []
    let totalTime = 24 * 3600 * 1000
    let spanTime = totalTime / count
    let startTime = new Date(dateTime)
    startTime.setHours(0, 0, 0, 0)
    let currentTime = startTime.getTime()
    for (var i = 0; i < count; i++) {
        currentTime += spanTime
        let date = new Date(currentTime)
        let hour = date.getHours()
        let minus = date.getMinutes()
        times.push(`${hour < 10 ? '0' + hour : hour}:${minus < 10 ? '0' + minus : minus}`)
    }
    return times
}