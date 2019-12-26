import axios from 'axios'
export function isAbsolutePath(path) {
    return /^(https?|tel|mailto)/.test(path)
}
export function isvalidPhone(str) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
}
export function isValidBankNum(bankCode) {
    let bank = /^\d+$/
    let validReqUrl = 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardBinCheck=true'
    if (!bank.test(bankCode) || bankCode === '') {
        return false
    } else {
        axios.post(validReqUrl, {
            cardNo: parseInt(bankCode)
        }).then(res => {
            if (res.validated && res.cardType == 'DC') {
                return true
            }
            return false
        })
    }

}
export function isValidNumber() {
    return typeof value === 'number' && !isNaN(value);
}