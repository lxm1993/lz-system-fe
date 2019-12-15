const CryptoJS = require('crypto-js');
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');

module.exports.decrypt = async (crypted) => {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(crypted);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}