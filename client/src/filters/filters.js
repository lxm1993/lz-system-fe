import { parseTime } from '@/utils/index'
export const date = val => {
    if (!val) {
        return ''
    }
    return parseTime(val, '{y}-{m}-{d}')
}

export const time = val => {
    if (!val) {
        return ''
    }
    return parseTime(val)
}

export const array = val => {
    if (!val || !Array.isArray(val) || val.length === 0) {
        return ''
    }
    return val.join(',')
}

export const string = val => {
    if (val == null || val === '') {
        return ''
    }
    if (typeof val === 'object') {
        return val.toString()
    }
    return val
}
export const boolean = val => {
    if (![0, 1].includes(val)) {
        return ''
    }
    if (val) {
        return '是'
    } else {
        return '否'
    }
}
export const email = val => {
    if (!val) {
        return ''
    }
    return `${val}@sohu-inc.com`
}

export const roles = val => {
    if (!val) {
        return ''
    }
    return val.join()
}

export const roleStatus = val => {
    if (!val) {
        return ''
    }
    return val === 1 ? '  启用' : '停用'
}

export const toPercent = val => {
    if (!val) {
        return ''
    }
    return `${Number(val * 100).toFixed(2)}%`
}